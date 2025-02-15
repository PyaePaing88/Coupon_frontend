import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company } from '../entities/company';
import { Observable } from 'rxjs';
import { Coupon } from '../entities/Coupon';
import { Coupontype } from '../entities/CouponType';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl= environment.apiUrl;
  private coupon:Coupon;

  constructor(public httpClinet:HttpClient) { }

  public createCoupon(coupon:Coupon):Observable<Coupon>{
    return this.httpClinet.post<Coupon>(`${this.baseUrl}rest/Company/createCoupon`,coupon,{withCredentials:true});
  }

public deleteCoupon(couponId:number):Observable<Company>{
  return this.httpClinet.delete<any>(`${this.baseUrl}rest/Company/removeCoupon/`+couponId,{withCredentials:true});
}

public updateCoupon(coupon:Coupon):Observable<Coupon>{
  return this.httpClinet.put<Coupon>(`${this.baseUrl}rest/Company/updateCoupon`,coupon,{withCredentials:true});
}

public viewAllCompanyCoupons():Observable<Coupon[]>{
  return this.httpClinet.get<Coupon[]>(`${this.baseUrl}rest/Company/getAllCoupons/`,{withCredentials:true});
}

public viewAllCompanyCouponsBytype(couponType:Coupontype):Observable<Coupon[]>{
  return this.httpClinet.get<Coupon[]>(`${this.baseUrl}rest/Company/getCouponsByType/`+couponType,{withCredentials:true});
}

public viewAllCompanyCouponsByPrice(price:number):Observable<Coupon[]>{
  return this.httpClinet.get<Coupon[]>(`${this.baseUrl}rest/Company/getCouponsByPrice/`+price,{withCredentials:true});
}
public viewAllCompanyCouponsByDate(date:Date):Observable<Coupon[]>{
  return this.httpClinet.get<Coupon[]>(`${this.baseUrl}rest/Company/getCouponsByDate/`+date,{withCredentials:true});
}
}
