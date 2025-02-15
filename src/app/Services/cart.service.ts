import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private mainApiUrl=environment.apiUrl;
  private basedUrl = `${this.mainApiUrl}cart`;
  constructor(private http: HttpClient) {}

  addToCart(cart: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.basedUrl}/add`, cart, { headers });
  }

  getCartByUserId(userId: number): Observable<Cart[]> {
    const url = `${this.basedUrl}/public/list/${userId}`;
    return this.http.get<Cart[]>(url);
  }

  deleteCartItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.basedUrl}/delete/${itemId}`);
  }

  increaseQuantity(cartId: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.basedUrl}/increase/${cartId}`, null); // Send PUT request to increase quantity
  }

  // Method to decrease the quantity of a cart item
  decreaseQuantity(cartId: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.basedUrl}/decrease/${cartId}`, null); // Send PUT request to decrease quantity
  }
}