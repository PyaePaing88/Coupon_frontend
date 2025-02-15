import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { Observable } from 'rxjs';
import { Service } from '../models/service';
import { Business } from '../models/business';
import { environment } from '../../environments/environment';

export interface CategoryDTO {
  id: number;
  name: string;
  isDelete: boolean;
}

export interface ServiceDTO {
  id: number;
  name: string;
  isDelete: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private baseUrl = environment.apiUrl;
  CURL = `${this.baseUrl}Category`;
  SURL = `${this.baseUrl}Service`;
  BURL = `${this.baseUrl}Business`;

  constructor(private http: HttpClient) {}

  createCategory(category: Category): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.CURL + '/create', category, { headers });
  }

  createService(service: Service): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.SURL + '/create', service, { headers });
  }

  createBusiness(formData: FormData): Observable<any> {
    return this.http.post(this.BURL + '/create', formData);
  }

  getCategory(): Observable<any[]> {
    return this.http.get<any[]>(this.CURL + '/public/list');
  }

  updateCategory(id: number, category: CategoryDTO): Observable<CategoryDTO> {
    return this.http.put<CategoryDTO>(
      `${this.CURL}/updateCategory/${id}`,
      category
    );
  }

  updateCategoryStatus(
    id: number,
    isDeleted: boolean
  ): Observable<CategoryDTO> {
    const updatedCategory = { isDeleted: isDeleted }; // Set the status as deleted
    return this.http.put<CategoryDTO>(
      `${this.CURL}/updateCategory/${id}`,
      updatedCategory
    );
  }

  // Soft delete category by ID
  deleteCategory(id: number): Observable<any> {
    return this.http.put<any>(`${this.CURL}/delete/${id}`, {});
  }

  getService(): Observable<any[]> {
    return this.http.get<any[]>(this.SURL + '/public/list');
  }

  updateService(id: number, service: ServiceDTO): Observable<CategoryDTO> {
    return this.http.put<ServiceDTO>(
      `${this.SURL}/updateService/${id}`,
      service
    );
  }

  updateServiceStatus(id: number, isDeleted: boolean): Observable<Service> {
    const updatedService = { isDeleted: isDeleted }; // Set the status as deleted
    return this.http.put<ServiceDTO>(
      `${this.SURL}/updateService/${id}`,
      updatedService
    );
  }

  // Soft delete category by ID
  deleteService(id: number): Observable<any> {
    return this.http.put<any>(`${this.SURL}/delete/${id}`, {});
  }

  getBusiness(): Observable<any[]> {
    return this.http.get<any[]>(this.BURL + '/public/list');
  }

  getBusinessbyUserId(userId: number): Observable<Business> {
    return this.http.get<Business>(`${this.BURL}/getByUserId/${userId}`);
  }

  getBusinessById(id: number): Observable<Business> {
    return this.http.get<Business>(`${this.BURL}/getById/${id}`);
  }

  updateBusinessById(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.BURL}/edit/${id}`, formData);
  }

  deleteBusiness(id: number): Observable<any> {
    return this.http.post(`${this.BURL}/delete/${id}`, {});
  }

  getBusinessBycategoryName(categoryName: string): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.BURL}/${categoryName}`);
  }

  getDeletedBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.BURL}/deleted`);
  }

  restoreBusiness(businessId: number): Observable<any> {
    return this.http.put<any>(`${this.BURL}/restore/${businessId}`, {});
  }

  getBusinessNamesAndIds(): Observable<Business[]> {
    return this.http.get<Business[]>(this.BURL + '/names');
  }

  // toggleBusinessStatus(id: number): Observable<{message: string}> {
  //   return this.http.put<{message: string}>(`${this.BURL}/toggle/${id}`, {});
  // }


}
