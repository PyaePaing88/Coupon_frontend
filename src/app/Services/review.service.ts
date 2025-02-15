import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private mainUrl = environment.apiUrl;
  private apiUrl = `${this.mainUrl}reviews/save`;
  private baseUrl = `${this.mainUrl}reviews/public/list`; // Replace with your API URL
  private abiUrl: string = `${this.mainUrl}reviews/public/business`;
  private aciUrl = `${this.mainUrl}reviews`;
  
  constructor(private http: HttpClient) {}

  // Method to submit a new review
  addReview(review: Review): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, review, { headers });
  }

  // Method to fetch all reviews from the backend
  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.baseUrl);
  }

  getReviewsByBusinessId(businessId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.abiUrl}/${businessId}`);
  }

  countReviewsByBusinessId(businessId: number): Observable<number> {
    const url = `${this.mainUrl}reviews/countReviewsByBusinessId/${businessId}`;
    return this.http.get<number>(url);
  }

  countCouponsByBusinessId(businessId: number): Observable<number> {
    const url = `${
      (this, this.baseUrl)
    }coupon/countCouponsByBusinessId/${businessId}`;
    return this.http.get<number>(url);
  }

  countConfirmedCouponsByBusinessId(businessId: number): Observable<number> {
    const url = this.mainUrl + 'coupon/countCouponsByBusinessId/' + businessId;
    return this.http.get<number>(url);
  }

  updateReviewAction(reviewId: number, action: string, userId: number): Observable<any> {
    const params = { action, userId: userId.toString() };
    return this.http.post(`${this.aciUrl}/action/${reviewId}`, null, {
       params ,
       responseType: 'text',
      });
  }

}
