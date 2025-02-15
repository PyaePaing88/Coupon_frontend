import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '../Services/business.service';
import { CouponService } from '../Services/coupon.service';
import { RevenueService } from '../Services/revenue.service';
import { Business } from '../models/business';
import { Coupon } from '../models/Coupon';
import { environment } from '../../environments/environment';
import { Revenue } from '../models/revenue';
import { PaidCoupon } from '../models/paid-coupon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-adm-cash-out',
  templateUrl: './adm-cash-out.component.html',
  styleUrls: ['./adm-cash-out.component.css'],
})
export class AdmCashOutComponent implements OnInit {
  isSidebarCollapsed = false;
  title: any;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  baseUrl = environment.apiUrl;

  totalQuantity = 0;
  totalUnitPrice = 0;
  totalCashOut = 0; // Holds the calculated cash-out value
  percentage = 0; // Default percentage

  filterForm!: FormGroup;
  businesses: Business[] = [];
  coupons: Coupon[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private businessService: BusinessService,
    private couponService: CouponService,
    private revenueService: RevenueService, // Inject the RevenueService
    private fb: FormBuilder,
    private toastaService: ToastrService // Inject the ToastaService
  ) {}

  ngOnInit(): void {
    this.loadBusinesses();

    this.filterForm = this.fb.group({
      selectedBusiness: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.filterForm.valid) {
      const { selectedBusiness, fromDate, toDate } = this.filterForm.value;

      this.isLoading = true;
      this.errorMessage = ''; // Clear previous error messages

      this.couponService
        .getCouponsByBusinessAndDateRange(selectedBusiness, fromDate, toDate)
        .subscribe({
          next: (data: Coupon[]) => {
            console.log('Raw coupons:', data); // ✅ Log raw response

            // Ensure proper filtering where paid_status is false
            this.coupons = data.filter((coupon) => coupon.paid_status === true);

            this.isLoading = false;
            console.log('Filtered coupons:', this.coupons); // ✅ Log filtered coupons
            this.calculateTotals();
          },
          error: (error) => {
            console.error('Error fetching coupons:', error);
            this.errorMessage = 'Failed to fetch coupons. Please try again.';
            this.isLoading = false;
          },
        });
    } else {
      console.error('Form is invalid');
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }

  // Load businesses from the backend
  loadBusinesses(): void {
    this.businessService.getBusinessNamesAndIds().subscribe(
      (data) => {
        this.businesses = data;
      },
      (error) => {
        console.error('Error fetching businesses', error);
      }
    );
  }

  calculateTotals(): void {
    this.totalQuantity = this.coupons.length;

    this.totalUnitPrice = this.coupons.reduce((sum, coupon) => {
      return sum + (coupon.unit_price ?? 0);
    }, 0);
    this.calculateTotalCashOut();
  }

  calculateTotalCashOut(): void {
    this.totalCashOut =
      this.totalUnitPrice - (this.totalUnitPrice * this.percentage) / 100;
  }

  // Handle Cash out button click
  cashOut(): void {
    if (this.totalCashOut > 0 && this.coupons.length > 0) {
      const { selectedBusiness } = this.filterForm.value;

      // Create Revenue object
      const revenueDTO = {
        businessId: selectedBusiness, // businessId (instead of business object)
        payDate: new Date().toISOString(), // pay_date (current date)
        fromDate: new Date(this.filterForm.value.fromDate).toISOString(), // from_date
        toDate: new Date(this.filterForm.value.toDate).toISOString(), // to_date
        totalAmount: this.totalUnitPrice, // total_amount
        payAmount: this.totalCashOut, // pay_amount
        percentage: this.percentage, // percentage
        quantity: this.totalQuantity, // quantity
        paidCoupons: this.coupons.map((coupon) => ({ couponId: coupon.id })), // paidCoupons as DTOs
      };

      // Save Revenue and PaidCoupons in a single flow
      this.revenueService.saveRevenue(revenueDTO).subscribe(
        (response) => {
          console.log('Revenue saved successfully:', response); // response will be the plain string

          // Success notification using Toasta
          this.toastaService.success(
            'Revenue and paid coupons saved successfully.',
            'Cash-out successful!'
          );
        },
        (error) => {
          console.error('Error saving revenue:', error);

          // Error notification using Toasta
          this.toastaService.error(
            'Failed to save revenue.',
            'Please try again.'
          );
        }
      );
    } else {
      console.error('Invalid data for cash-out');
      this.errorMessage =
        'Please make sure everything is correct before cashing out.';
    }
  }
}
