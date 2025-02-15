import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Revenue } from '../models/revenue';
import { PaidCoupon } from '../models/paid-coupon';
import { map } from 'rxjs/operators';

export interface PaidCouponDTO {
  couponId: number;
}

export interface RevenueDTO {
  businessId: number;
  payDate: string;
  fromDate: string;
  toDate: string;
  totalAmount: number;
  payAmount: number;
  percentage: number;
  quantity: number;
  paidCoupons: PaidCouponDTO[];
}

@Injectable({
  providedIn: 'root',
})
export class RevenueService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  saveRevenue(revenueDTO: RevenueDTO): Observable<string> {
    const url = `${this.apiUrl}revenue/save`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(url, revenueDTO, {
      headers,
      responseType: 'text' as 'json',
    });
  }

  getALL(): Observable<Revenue[]> {
    return this.http.get<Revenue[]>(`${this.apiUrl}revenue/ListAll`);
  }

  getPaidCouponsByRevenueId(revenueId: number): Observable<PaidCoupon[]> {
    return this.http.get<PaidCoupon[]>(
      `${this.apiUrl}revenue/paidList/${revenueId}`
    );
  }

  getRevenuesByBusinessId(businessId: number): Observable<Revenue[]> {
    return this.http.get<Revenue[]>(
      `${this.apiUrl}revenue/byBusiness/${businessId}`
    );
  }
}
