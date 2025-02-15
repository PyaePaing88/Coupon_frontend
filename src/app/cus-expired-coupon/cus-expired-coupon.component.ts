import { Component } from '@angular/core';
import { Coupon } from '../models/Coupon';
import { CouponService } from '../Services/coupon.service';
import { AuthService } from '../core/auth/auth.service';
import { TransferService } from '../Services/transfer.service';
import { Transfer } from '../models/transfer';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cus-expired-coupon',
  templateUrl: './cus-expired-coupon.component.html',
  styleUrl: './cus-expired-coupon.component.css',
})
export class CusExpiredCouponComponent {
  expiredCoupons: Coupon[] = [];
  receiveCoupons: Transfer[] = [];
  isDropdownVisible: boolean = false;
  baseUrl = environment.apiUrl;

  user_id!: number;

  Dropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  constructor(
    private service: TransferService,
    private authService: AuthService
  ) {
    const user = authService.getLoggedUser();
    if (user) {
      this.user_id = user.id;
    } else {
      console.error('User is null');
    }
  }

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.getExpiredCoupons(); // Fetch expired coupons
      this.getReceiveExpiredCoupons();
    }
  }

  getExpiredCoupons(): void {
    this.service.showCouponsbyUser_id(this.user_id).subscribe(
      (data: Coupon[]) => {
        const currentDate = new Date();
        this.expiredCoupons = data.filter((coupon) => {
          return (
            coupon.expired_date && new Date(coupon.expired_date) < currentDate
          );
        });
      },
      (error) => console.error('Error fetching expired coupons:', error)
    );
  }

  getReceiveExpiredCoupons(): void {
    this.service.showReceiveList(this.user_id).subscribe(
      (data: Transfer[]) => {
        const currentDate = new Date();
        this.receiveCoupons = data.filter((coupon) => {
          return (
            coupon.expired_date && new Date(coupon.expired_date) < currentDate
          );
        });
      },
      (error) => console.error('Error fetching receive expired coupons:', error)
    );
  }
}
