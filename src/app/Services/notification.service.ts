import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyNotification } from '../models/my-notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
baseurl=environment.apiUrl;
constructor(private http: HttpClient){}

  getNotification(userId:number):Observable<MyNotification[]>{
    return this.http.get<MyNotification[]>(`${this.baseurl}user/getNotification/${userId}`);
  }
  deleteNoti(noti_id: number): Observable<void> {
    const url = `${this.baseurl}user/notifications/${noti_id}`;
    return this.http.put<void>(url, null); 
  }
  makeRead(noti_id: number): Observable<void> {
    const url = `${this.baseurl}user/makeRead/${noti_id}`;
    return this.http.put<void>(url, null); 
  }
  
}
