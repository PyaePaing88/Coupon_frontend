import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UserPhoto } from '../models/user-photo';
import { url } from 'node:inspector';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiUrl;
  private getAllUrl = `${this.baseUrl}user/public/list`;
  private getById = `${this.baseUrl}user/public/getById`;
  private photoupload = `${this.baseUrl}user/uploadPhoto`;
  private apiUrl = `${this.baseUrl}user`;
  private Url = this.baseUrl;

  public constructor(private httpClient: HttpClient) {}

  registerUser(user: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'user/addUser', user);
  }

  uploadPhoto(userId: number, image: File): Observable<UserPhoto> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('image', image);

    return this.httpClient.post<UserPhoto>(this.photoupload, formData);
  }

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.getAllUrl);
  }

  countALlUser(): Observable<number> {
    return this.httpClient.get<number>(this.apiUrl + '/countALlUser');
  }

  countALlBusiness(): Observable<number> {
    return this.httpClient.get<number>(this.Url + 'Business/countALlBusiness');
  }

  countALlPackages(): Observable<number> {
    return this.httpClient.get<number>(this.Url + 'package/countALlPackages');
  }

  countALlCoupons(): Observable<number> {
    return this.httpClient.get<number>(this.Url + 'coupon/countALlCoupons');
  }

  getUserDetailsById(userId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.getById}/${userId}`);
  }

  // Method to update user details
  updateUserDetails(userId: number, userDetails: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/${userId}`, userDetails);
  }

  changePassword(userId: number, passwordData: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Ensure this header is set
    });

    return this.httpClient.put(
      `${this.baseUrl}user/change-password/${userId}`,
      passwordData,
      { headers, responseType: 'text' } // Specify the responseType as 'text'
    );
  }

  resetPassword(userId: number, newPassword: string): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('newPassword', newPassword);

    return this.httpClient.post(`${this.apiUrl}/reset-password`, null, {
      params,
      responseType: 'text', // Expect a plain text response
    });
  }

  getEmailSuggestions(query: string): Observable<string[]> {
    const url = `${this.apiUrl}/emails?query=${encodeURIComponent(query)}`;
    return this.httpClient.get<string[]>(url);
  }

  getUnreadNoti(id:number):Observable<any>{
    const url = `${this.baseUrl}user/countNoti/${id}`;
    return this.httpClient.get<number>(url);
  }
  // Delete user by ID
  deleteUserById(id: number): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/delete/${id}`, {});
  }
 
}
