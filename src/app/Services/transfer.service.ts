import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Transfer } from '../models/transfer';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private baseUrl = environment.apiUrl;
  CURL = `${this.baseUrl}coupon`;

  constructor(private http: HttpClient) {}

  // showAllCoupons(): Observable<Coupon[]> {
  //   return this.http.get<Coupon[]>(this.CURL + "/list");
  // }

  showCouponsbyUser_id(user_id: number): Observable<any> {
    // Assuming your backend accepts the user ID in the request URL or as a query parameter
    return this.http.get<any[]>(`${this.CURL}/public/list/${user_id}`);
  }

  transferCouponRequest(
    sender_id: number,
    receiverEmail: string,
    coupon_id: number,
    note: string
  ): Observable<Transfer> {
    const transferRequest = {
      sender_id: sender_id,
      receiverEmail: receiverEmail,
      coupon_id: coupon_id,
      note: note
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<Transfer>(`${this.CURL}/transfer`, transferRequest, {headers});
  }

  showTransferList(sender_id: number): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(
      `${this.CURL}/public/transferlist/${sender_id}`
    );
  }

  showReceiveList(receiver_id: number): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(
      `${this.CURL}/public/receivelist/${receiver_id}`
    );
  }
}
