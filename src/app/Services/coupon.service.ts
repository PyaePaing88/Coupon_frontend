// coupon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Qr } from '../models/qr';
import { Coupon } from '../models/Coupon';
import { environment } from '../../environments/environment';
import { Business } from '../models/business';
import { Transfer } from '../models/transfer';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private baseUrl = environment.apiUrl;
  private apiUrl = `${this.baseUrl}coupon`; // Replace with your actual API URL
  constructor(private http: HttpClient) {}

  // Method to accept purchase and generate QR codes
  acceptPurchase(purchaseId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/accept/${purchaseId}`,
      null
    );
  }

  // Method to decline a purchase
  declinePurchase(purchaseId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/decline/${purchaseId}`,
      null
    );
  }

  getQRCode(couponId: number): Observable<Qr> {
    return this.http.get<Qr>(`${this.apiUrl}/code/${couponId}`);
  }

  getAll(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.baseUrl}coupon/admin/find`);
  }

  getByuserId(userId: number): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(
      `${this.baseUrl}coupon/public/findbyUserId/` + userId
    );
  }

  getBybusinessId(businessId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}coupon/public/findbyBusinessId/` + businessId
    );
  }

  getScanedCouponBybusinessId(businessId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}coupon/public/findScanedCouponbyBusinessId/` + businessId
    );
  }

  downloadReport(fileType: 'pdf' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.baseUrl}coupon/report?fileType=${fileType}`, {
      responseType: 'blob',
    });
  }

  downloadReportByBusinessId(
    businessId: number,
    fileType: 'pdf' | 'excel'
  ): Observable<Blob> {
    const url = `${this.baseUrl}coupon/exportCouponReport?businessId=${businessId}&fileType=${fileType}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  downloadScanedCouponReportByBusinessId(
    businessId: number,
    fileType: 'pdf' | 'excel'
  ): Observable<Blob> {
    const url = `${this.baseUrl}coupon/exportScanedCouponReport?businessId=${businessId}&fileType=${fileType}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getCouponByPurchaseId(purchase_id: number): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(
      `${this.apiUrl}/listbypurchaseId/${purchase_id}`
    );
  }

  searchCoupon(body: {
    businessId: string;
    couponCode: string;
  }): Observable<Coupon> {
    const url = `${this.baseUrl}coupon/searchCoupon`; // Adjust endpoint path as necessary
    return this.http.post<Coupon>(url, body); // HTTP POST request to search for the coupon
  }
  confrimTouse(body: { couponId: number; userId: number }): Observable<any> {
    const url = `${this.baseUrl}coupon/comfrimedTouse`;
    return this.http.put<any>(url, body);
  }
  getBusinessByCouponId(couponId: number): Observable<Business> {
    const url = `${this.apiUrl}/findBusiness/${couponId}`; // Assuming your endpoint is like this
    return this.http.get<Business>(url);
  }

  getConfirmedCouponsByPurchaseDate(
    startDate: string,
    endDate: string
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<any[]>(`${this.apiUrl}/confirm-count`, { params });
  }

  getCouponCountByBusiness(
    businessId: number,
    startDate: string,
    endDate: string
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('businessId', businessId.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<any[]>(`${this.apiUrl}/coupon-count`, { params });
  }

  getCouponsByBusinessAndDateRange(
    businessId: number,
    startDate: string,
    endDate: string
  ): Observable<Coupon[]> {
    const url = `${
      this.baseUrl
    }coupon/filter2?businessId=${businessId}&startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`;

    return this.http.get<Coupon[]>(url).pipe(
      map((coupons) => {
        console.log('Raw response:', coupons); // ✅ Log raw data from backend

        const processedCoupons = coupons.map(
          (coupon) =>
            new Coupon({
              ...coupon,
              expired_date: coupon.expired_date
                ? new Date(coupon.expired_date)
                : null,
              purchase_date: coupon.purchase_date
                ? new Date(coupon.purchase_date)
                : null,
              used_date: coupon.used_date ? new Date(coupon.used_date) : null,
            })
        );

        console.log('Processed response:', processedCoupons); // ✅ Log formatted data
        return processedCoupons;
      })
    );
  }

  filterCoupons(
    searchText: string,
    selectedCategory: string,
    startDate: Date | undefined,
    endDate: Date | undefined
  ) {
    let url = `${this.baseUrl}coupon/filter?searchText=${searchText}&selectedCategory=${selectedCategory}`;

    if (startDate) {
      url += `&startDate=${startDate.toISOString().split('T')[0]}`;
    }

    if (endDate) {
      url += `&endDate=${endDate.toISOString().split('T')[0]}`;
    }

    return this.http.get<Coupon[]>(url);
  }

  getFilterCouponsByBusinessId(
    businessId: number,
    searchText: string,
    selectedCategory: string,
    startDate: Date | undefined,
    endDate: Date | undefined
  ) {
    let url = `${this.baseUrl}coupon/filterByBusinessId?businessId=${businessId}&searchText=${searchText}&selectedCategory=${selectedCategory}`;

    if (startDate) {
      url += `&startDate=${startDate.toISOString().split('T')[0]}`;
    }

    if (endDate) {
      url += `&endDate=${endDate.toISOString().split('T')[0]}`;
    }

    return this.http.get<Coupon[]>(url);
  }

  getScanedFilterCouponsByBusinessId(
    businessId: number,
    searchText: string,
    selectedCategory: string,
    startDate: Date | undefined,
    endDate: Date | undefined
  ) {
    let url = `${this.baseUrl}coupon/ScanedfilterByBusinessId?businessId=${businessId}&searchText=${searchText}&selectedCategory=${selectedCategory}`;

    if (startDate) {
      url += `&startDate=${startDate.toISOString().split('T')[0]}`;
    }

    if (endDate) {
      url += `&endDate=${endDate.toISOString().split('T')[0]}`;
    }

    return this.http.get<Coupon[]>(url);
  }

  downloadFilteredCouponsReport(
    searchText: string,
    selectedCategory: string,
    startDate: any,
    endDate: any,
    fileType: 'pdf' | 'excel'
  ): Observable<any> {
    if (!(startDate instanceof Date)) {
      startDate = new Date(startDate);
    }
    if (!(endDate instanceof Date)) {
      endDate = new Date(endDate);
    }

    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    const params = new HttpParams()
      .set('searchText', searchText)
      .set('selectedCategory', selectedCategory)
      .set('startDate', startDateStr)
      .set('endDate', endDateStr)
      .set('fileType', fileType);

    return this.http.get(`${this.baseUrl}coupon/exportFilteredReport`, {
      params,
      responseType: 'blob',
    });
  }

  downloadFilteredCouponsReportbybusienssId(
    businessId: number,
    searchText: string,
    selectedCategory: string,
    startDate: any,
    endDate: any,
    fileType: 'pdf' | 'excel'
  ): Observable<any> {
    if (!(startDate instanceof Date)) {
      startDate = new Date(startDate);
    }
    if (!(endDate instanceof Date)) {
      endDate = new Date(endDate);
    }

    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    const params = new HttpParams()
      .set('businessId', businessId)
      .set('searchText', searchText)
      .set('selectedCategory', selectedCategory)
      .set('startDate', startDateStr)
      .set('endDate', endDateStr)
      .set('fileType', fileType);

    return this.http.get(
      `${this.baseUrl}coupon/exportFilteredReportbybusinessId`,
      {
        params,
        responseType: 'blob',
      }
    );
  }
  downloadScanedFilteredCouponsReportbybusienssId(
    businessId: number,
    searchText: string,
    selectedCategory: string,
    startDate: any,
    endDate: any,
    fileType: 'pdf' | 'excel'
  ): Observable<any> {
    if (!(startDate instanceof Date)) {
      startDate = new Date(startDate);
    }
    if (!(endDate instanceof Date)) {
      endDate = new Date(endDate);
    }

    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();

    const params = new HttpParams()
      .set('businessId', businessId)
      .set('searchText', searchText)
      .set('selectedCategory', selectedCategory)
      .set('startDate', startDateStr)
      .set('endDate', endDateStr)
      .set('fileType', fileType);

    return this.http.get(
      `${this.baseUrl}coupon/exportScanedFilteredReportbybusinessId`,
      {
        params,
        responseType: 'blob',
      }
    );
  }
  getPendingCouponCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}purchases/count-pending`);
  }

  // Function to get confirmed coupon count by package ID
  getConfirmedCouponCountByPackageID(id: number): Observable<number> {
    return this.http.get<number>(
      'http://localhost:8080/package/couponbyPackageId/' + id
    );
  }

  getUsedCouponsByUserId(userId: number): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(`${this.apiUrl}/used/${userId}`);
  }

  // Method to call the backend API to get used coupons by receiverId
  getUsedCouponsByReceiverId(receiverId: number): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(
      `${this.apiUrl}/usedtransfer/${receiverId}`
    );
  }
}
