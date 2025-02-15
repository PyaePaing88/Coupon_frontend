import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Coupon } from '../models/Coupon';
import { CouponService } from '../Services/coupon.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-scan-history',
  templateUrl: './scan-history.component.html',
  styleUrl: './scan-history.component.css',
})
export class ScanHistoryComponent {
  coupons: Coupon[] = [];
  businessId: number = 0;
  noCouponsFound: boolean = false;
  baseUrl = environment.apiUrl;

  constructor(
    private service: CouponService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.businessId = +params['businessId'] || 0;
      if (this.businessId > 0) {
        this.loadCoupons();
      } else {
        console.error('Business ID is not set!');
      }
    });
  }

  loadCoupons(): void {
    this.service.getScanedCouponBybusinessId(this.businessId).subscribe(
      (data) => {
        this.coupons = data;
      },
      (error) => {
        console.error('Coupon list not found', error);
      }
    );
  }
}
