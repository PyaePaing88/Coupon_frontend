import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PurchaseAndUserDTO {
  id: number;
  total_amount: number;
  total_quantity: number;
  payment_type: string;
  transaction_id: string;
  purchase_date: Date;
  confirm: string;
  user_id: number;
  user_name: string;
  user_photo: string;
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}purchases/public/listALL`; // Update with your backend URL
  private pieUrl = `${this.baseUrl}purchases/payment-type-distribution`;

  constructor(private http: HttpClient) {}

  getAllPurchases(): Observable<PurchaseAndUserDTO[]> {
    return this.http.get<PurchaseAndUserDTO[]>(this.apiUrl);
  }

  getPaymentTypeDistribution(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(this.pieUrl);
  }

  getConfirmedPurchaseCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}purchases/countConfirmed`);
  }
}
