import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Coupon } from '../models/Coupon';
import { CouponService } from '../Services/coupon.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-adm-coupon-salelist',
  templateUrl: './adm-coupon-salelist.component.html',
  styleUrl: './adm-coupon-salelist.component.css',
})
export class AdmCouponSalelistComponent {
  coupons: Coupon[] = [];
  filteredCoupons: Coupon[] = []; // Holds filtered coupons
  searchText: string = ''; // For search input
  selectedCategory: string = ''; // For category selection (purchaseDate/expiredDate)
  startDate: Date = new Date(); // Start date filter
  endDate: Date = new Date(); // End date filter

  baseUrl = environment.apiUrl;
  showFilters = false;
  dropdownVisible = false;

  constructor(
    private service: CouponService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchCoupons(); // Fetch initial coupon list on component load
  }

  // Fetch all coupons from the backend
  fetchCoupons(): void {
    this.service.getAll().subscribe((data: Coupon[]) => {
      this.coupons = data;
      this.filteredCoupons = data; // Initially, filtered coupons are the same as all coupons
    });
  }

  applyFilters() {
    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    if (start && end && end < start) {
      this.filteredCoupons = [];
      console.error('End date cannot be before start date.');
      return;
    }

    this.service
      .filterCoupons(this.searchText.trim(), this.selectedCategory, start, end)
      .subscribe(
        (response) => {
          this.filteredCoupons = response;
          this.totalAmount();
        },
        (error) => {
          console.error('Error fetching filtered coupons:', error);
        }
      );
  }

  // Calculate total amount of filtered coupons
  totalAmount(): number {
    return this.filteredCoupons.reduce(
      (sum, coupon) => sum + (coupon.unit_price || 0),
      0
    );
  }

  totalQuantity(): number {
    return this.filteredCoupons.length;
  }

  isSidebarCollapsed = false;
  title: any;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  downloadReport(fileType: 'pdf' | 'excel'): void {
    const isFiltered =
      (this.searchText && this.searchText.trim() !== '') ||
      (this.selectedCategory && this.selectedCategory.trim() !== '') ||
      (this.startDate &&
        this.startDate.toISOString().split('T')[0] !==
          new Date().toISOString().split('T')[0]) ||
      (this.endDate &&
        this.endDate.toISOString().split('T')[0] !==
          new Date().toISOString().split('T')[0]);

    const downloadFn = isFiltered
      ? this.service.downloadFilteredCouponsReport(
          this.searchText.trim(),
          this.selectedCategory.trim(),
          this.startDate,
          this.endDate,
          fileType
        )
      : this.service.downloadReport(fileType);

    downloadFn.subscribe(
      (response: any) => {
        const fileExtension = fileType === 'pdf' ? 'pdf' : 'xlsx';
        const mimeType =
          fileType === 'pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        const blob = new Blob([response], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coupons_report.${fileExtension}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading the report:', error);
      }
    );
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
}
