import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Coupon } from '../models/Coupon';
import { CouponService } from '../Services/coupon.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-business-sale',
  templateUrl: './business-sale.component.html',
  styleUrl: './business-sale.component.css',
})
export class BusinessSaleComponent {
  coupons: Coupon[] = [];
  filteredCoupons: Coupon[] = [];
  searchText: string = '';
  selectedCategory: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  businessId: number = 0;
  noCouponsFound: boolean = false;
  baseUrl = environment.apiUrl;
  showFilters = false;
  dropdownVisible = false;

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
    this.service.getBybusinessId(this.businessId).subscribe(
      (data) => {
        this.coupons = data;
        this.filteredCoupons = [...this.coupons];
      },
      (error) => {
        console.error('Coupon list not found', error);
      }
    );
  }

  applyFilters(): void {
    const start = this.startDate ? new Date(this.startDate) : undefined;
    const end = this.endDate ? new Date(this.endDate) : undefined;

    if (start && end && end < start) {
      this.filteredCoupons = [];
      console.error('End date cannot be before start date.');
      return;
    }

    this.service
      .getFilterCouponsByBusinessId(
        this.businessId,
        this.searchText,
        this.selectedCategory,
        start,
        end
      )
      .subscribe(
        (response) => {
          this.filteredCoupons = response;
        },
        (error) => {
          console.error('Error fetching filtered coupons:', error);
        }
      );
  }

  totalAmount(): number {
    return this.filteredCoupons.reduce(
      (sum, coupon) => sum + (coupon.unit_price || 0),
      0
    );
  }

  totalQuantity(): number {
    return this.filteredCoupons.length;
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
      ? this.service.downloadFilteredCouponsReportbybusienssId(
          this.businessId,
          this.searchText.trim(),
          this.selectedCategory.trim(),
          this.startDate,
          this.endDate,
          fileType
        )
      : this.service.downloadReportByBusinessId(this.businessId, fileType);

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
