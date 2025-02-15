import { Component, OnInit } from '@angular/core';
import { Cart } from '../models/cart';
import { CartService } from '../Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PaymentDataShareService } from '../Services/payment-data-share.service';
import { AuthService } from '../core/auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cus-cart',
  templateUrl: './cus-cart.component.html',
  styleUrls: ['./cus-cart.component.css'], // Fixed 'styleUrl' to 'styleUrls'
})
export class CusCartComponent implements OnInit {
  userId: number = 0;
  cartItems: Cart[] = []; // Always initialize
  baseUrl = environment.apiUrl;

  constructor(
    private paymentDataShare: PaymentDataShareService,
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.getToken()) {
      const user = this.authService.getLoggedUser();
      if (user && user.id) {
        this.userId = user.id;
        this.loadCartItems();
      } else {
        console.error('Invalid user data.');
      }
    } else {
      console.error('User not authenticated.');
    }
  }

  loadCartItems(): void {
    this.cartService.getCartByUserId(this.userId).subscribe(
      (data: Cart[]) => {
        this.cartItems = data || []; // Fallback to empty array if data is null/undefined
      },
      (error) => {
        console.error('Error fetching cart items:', error);
        this.toastr.error(
          'Failed to load cart items. Please try again.',
          'Error'
        );
      }
    );
  }

  removeItem(itemId: number): void {
    this.cartService.deleteCartItem(itemId).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(
          (cartItem) => cartItem.id !== itemId
        );
        this.toastr.success('Item removed from cart successfully!', 'Success');
      },
      (error) => {
        console.error('Error removing item from cart:', error);
        this.toastr.error(
          'Error removing item from cart. Please try again.',
          'Error'
        );
      }
    );
  }

  increaseQuantity(item: Cart): void {
    this.cartService.increaseQuantity(item.id).subscribe(
      () => {
        item.unit_quantity++;
        this.toastr.success('Quantity increased!', 'Success');
      },
      (error) => {
        console.error('Error increasing quantity:', error);
        this.toastr.error(
          'Failed to increase quantity. Please try again.',
          'Error'
        );
      }
    );
  }

  decreaseQuantity(item: Cart): void {
    if (item.unit_quantity > 1) {
      this.cartService.decreaseQuantity(item.id).subscribe(
        () => {
          item.unit_quantity--;
          this.toastr.success('Quantity decreased!', 'Success');
        },
        (error) => {
          console.error('Error decreasing quantity:', error);
          this.toastr.error(
            'Failed to decrease quantity. Please try again.',
            'Error'
          );
        }
      );
    } else {
      console.warn('Quantity cannot be less than 1.');
      this.toastr.warning('Minimum quantity is 1.', 'Warning');
    }
  }

  getItemCountText(): string {
    const count = this.cartItems.length;
    return count === 1 ? `${count} item` : `${count} items`;
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.unit_price * item.unit_quantity,
      0
    );
  }

  checkout(): void {
    const cartItems = encodeURIComponent(JSON.stringify(this.cartItems));
    this.router.navigate(['/cart-payment'], {
      queryParams: { items: cartItems },
    });
  }
}
