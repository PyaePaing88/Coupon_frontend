import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PaymentMethod } from '../models/payment-method';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}payment_method`; // Backend URL
  // Backend URL

  constructor(private http: HttpClient) {}
  createPaymentMethod(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, formData); // Corrected endpoint for saving
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}/public/list`);
  }

  deletePaymentMethod(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  updatePaymentMethod(
    id: number,
    formData: FormData
  ): Observable<PaymentMethod> {
    return this.http.put<PaymentMethod>(`${this.apiUrl}/edit/${id}`, formData);
  }
}
