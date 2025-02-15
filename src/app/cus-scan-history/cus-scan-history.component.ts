import { Component } from '@angular/core';
import { Transfer } from '../models/transfer';
import { environment } from '../../environments/environment';
import { CouponService } from '../Services/coupon.service';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-cus-scan-history',
  templateUrl: './cus-scan-history.component.html',
  styleUrl: './cus-scan-history.component.css',
})
export class CusScanHistoryComponent {
  useList: Transfer[] = [];
  reciveList: Transfer[] = [];
  userId!: number;
  isDropdownVisible: boolean = false;

  baseUrl = environment.apiUrl;

  constructor(
    private couponService: CouponService,
    private authservice: AuthService
  ) {
    const user = authservice.getLoggedUser();
    if (user) {
      this.userId = user.id;
    } else {
      console.error('User is null');
    }
  }

  Dropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  ngOnInit(): void {
    if (this.authservice.getToken()) {
      this.getUsedCoupons();
      this.getUsedCouponsByReceiverId();
    }
  }

  getUsedCoupons(): void {
    this.couponService.getUsedCouponsByUserId(this.userId).subscribe(
      (coupons) => {
        this.useList = coupons;
      },
      (error) => {
        console.error('Error fetching used coupons', error);
      }
    );
  }


  getUsedCouponsByReceiverId(): void {
    this.couponService.getUsedCouponsByReceiverId(this.userId)
      .subscribe({
        next: (data) => {
          this.reciveList = data;
        },
        error: (err) => {
          console.error('Error fetching used coupons', err);
        }
      });
  }

}
