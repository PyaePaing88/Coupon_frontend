import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RevenueService } from '../Services/revenue.service';
import { Revenue } from '../models/revenue';
import { PaidCoupon } from '../models/paid-coupon';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-business-cash-in',
  templateUrl: './business-cash-in.component.html',
  styleUrls: ['./business-cash-in.component.css'], // Fixed "styleUrl" to "styleUrls"
})
export class BusinessCashInComponent implements OnInit {
  revenues: Revenue[] = [];
  businessRevenues: Revenue[] = [];
  filteredRevenues: Revenue[] = [];
  searchQuery: string = '';
  selectedDate: string = '';
  paidCoupons: PaidCoupon[] = [];
  groupedCoupons: any[] = [];
  selectedRevenueId: number | null = null;
  isModalOpen: boolean = false;
  businessId: number = 0; // Hardcoded business ID for now
  baseUrl = environment.apiUrl;

  constructor(
    private revenueService: RevenueService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.businessId = +params['businessId'] || 0;
      if (this.businessId > 0) {
        this.loadRevenuesByBusinessId();
      } else {
        console.error('Business ID is not set!');
      }
    });
  }

  /**
   * Fetch revenues by business ID.
   */
  loadRevenuesByBusinessId(): void {
    this.revenueService.getRevenuesByBusinessId(this.businessId).subscribe(
      (data) => {
        this.businessRevenues = data;
        this.filteredRevenues = data; // Initialize filteredRevenues with fetched data
        console.log(`Revenues for Business ID ${this.businessId}:`, data);
      },
      (error) => {
        console.error(
          `Error fetching revenues for business ID ${this.businessId}:`,
          error
        );
      }
    );
  }

  /**
   * Filter revenues based on search query and selected date.
   */
  filterRevenues(): void {
    this.filteredRevenues = this.businessRevenues.filter((revenue) => {
      const matchesSearch = revenue.businessName
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesDate =
        !this.selectedDate ||
        new Date(revenue.payDate).toISOString().slice(0, 10) ===
          this.selectedDate;

      return matchesSearch && matchesDate;
    });
  }

  /**
   * Update search query and filter results.
   */
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filterRevenues();
  }

  /**
   * Update selected date and filter results.
   */
  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.filterRevenues();
  }

  /**
   * Open the modal and fetch paid coupons for the selected revenue.
   */
  openModal(revenueId: number): void {
    this.selectedRevenueId = revenueId;
    this.fetchPaidCoupons(revenueId);
    this.isModalOpen = true;
  }

  /**
   * Fetch paid coupons by revenue ID.
   */
  fetchPaidCoupons(revenueId: number): void {
    this.revenueService.getPaidCouponsByRevenueId(revenueId).subscribe(
      (data: PaidCoupon[]) => {
        this.paidCoupons = data;
        this.groupCoupons(); // Group and count the coupons
      },
      (error) => {
        console.error('Error fetching paid coupons:', error);
      }
    );
  }

  /**
   * Group coupons by package name and count quantities.
   */
  groupCoupons(): void {
    const couponMap = new Map<string, any>();
    for (const coupon of this.paidCoupons) {
      const key = coupon.packageName; // You can use packageId if needed
      if (couponMap.has(key)) {
        couponMap.get(key).quantity++;
      } else {
        couponMap.set(key, { ...coupon, quantity: 1 });
      }
    }
    this.groupedCoupons = Array.from(couponMap.values());
  }

  /**
   * Close the modal and reset coupon data.
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.paidCoupons = [];
    this.groupedCoupons = [];
  }
}
