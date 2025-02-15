import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { History, DEFAULT_HISTORY } from '../models/history';
import { PurchaseDTO } from '../models/purchase-dto';
import { PaymentService } from '../Services/payment.service';
import { AuthService } from '../core/auth/auth.service';
import { CouponService } from '../Services/coupon.service';
import { Purchase } from '../models/purchase';
import { Coupon } from '../models/Coupon';
import html2canvas from 'html2canvas';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cus-history',
  templateUrl: './cus-history.component.html',
  styleUrl: './cus-history.component.css',
})
export class CusHistoryComponent {
  purchases: Purchase[] = [];
  loading: boolean = true;
  error: string | null = null;
  coupons: Coupon[] = [];
  selectedPayment: Purchase | null = null; // Selected payment details
  isModalOpen = false;

  baseUrl = environment.apiUrl;
  user_id!: number;

  constructor(
    private service: PaymentService,
    private couponService: CouponService,
    private authService: AuthService
  ) {
    const user = authService.getLoggedUser();
    if (user) {
      this.user_id = user.id;
    } else {
      this.error = 'User is not logged in.';
    }
  }

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.getPurchaseByUserId();
    }
  }

  getPurchaseByUserId(): void {
    this.service.getPurchasesByUserId(this.user_id).subscribe({
      next: (data) => {
        this.purchases = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'An error occurred while fetching payment history.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  // Open coupon modal for a selected purchase
  openCouponModal(purchase: Purchase): void {
    this.selectedPayment = purchase;
    this.couponService.getCouponByPurchaseId(purchase.id).subscribe(
      (coupons: Coupon[]) => {
        this.coupons = coupons;
        this.isModalOpen = true; // Open the modal
      },
      (error) => {
        this.error = 'Failed to load coupons';
        console.error(error);
      }
    );
  }

  // Close the modal
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPayment = null; // Reset selected payment
  }

  saveAsImage(): void {
    const paymentDiv = document.querySelector('.payment') as HTMLElement;

    if (paymentDiv) {
      html2canvas(paymentDiv, {
        useCORS: true, // Enables cross-origin image loading
        allowTaint: true, // Allows loading of tainted images
      })
        .then((canvas) => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'payment-details.png';
          link.click();
        })
        .catch((error) => {
          console.error('Error generating image:', error);
        });
    }
  }
}
