import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';
import { PurchaseRequest } from '../models/purchase-request';
import { Purchase } from '../models/purchase';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
    private baseUrl=environment.apiUrl;
  PURL = `${this.baseUrl}Payment`;
  apiUrl = `${this.baseUrl}purchases`;

  constructor(private http: HttpClient) {}

  savePayment(payment: Payment): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.PURL + '/save', payment, { headers });
  }

  savePurchase(purchaseRequest: PurchaseRequest): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/save`, purchaseRequest, {
      headers,
      responseType: 'text', // Explicitly set response type to text
    });
  }

  showAllPayment(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.PURL + '/list');
  }

  getPurchasesByUserId(user_id: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/public/list/${user_id}`);
  }
}
