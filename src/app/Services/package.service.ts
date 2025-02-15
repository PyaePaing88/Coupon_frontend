import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Packages } from '../models/package-model';
import { Business } from '../models/business';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private baseUrl=environment.apiUrl;
  constructor(private http: HttpClient) {}

  getALL(): Observable<Packages[]> {
    return this.http.get<Packages[]>(
      `${this.baseUrl}package/public/list`
    );
  }

  create(formData: FormData): Observable<any> {
    console.log(formData);
    return this.http.post(`${this.baseUrl}package/save`, formData);
  }

  findByid(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}package/public/find/` + id);
  }

  findBybusinessId(id: number): Observable<Packages[]> {
    return this.http.get<Packages[]>(
      `${this.baseUrl}package/public/findByBusinessId/${id}`
    );
  }

  updateByid(packages: Packages, selectedFile: File | null): Observable<any> {
    let url: string = `${this.baseUrl}package/update/` + packages.id;
    const formData = new FormData();

    formData.append(
      'packageDTO',
      new Blob([JSON.stringify(packages)], { type: 'application/json' })
    );

    if (selectedFile) {
      formData.append('image', selectedFile, selectedFile.name);
    }
    return this.http.put<any>(url, formData);
  }

  softDeletePackage(id: number): Observable<any> {
    let url = `${this.baseUrl}package/delete/` + id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.delete<any>(url, {
      headers,
      responseType: 'text' as 'json',
    });
  }

  countPackageByBusinessId(businessId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}package/countPackagesByBusinessId/` + businessId);
  }
  

  // Method to fetch deleted packages
  getDeletedPackages(): Observable<Packages[]> {
    return this.http.get<Packages[]>('http://localhost:8080/package/deleted');
  }

  restorePackage(packageId: number): Observable<any> {
    return this.http.put<any>('http://localhost:8080/package/restore/' + packageId, {});
  }
}
