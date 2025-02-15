import { Component, OnInit } from '@angular/core';
import { Revenue } from '../models/revenue';
import { RevenueService } from '../Services/revenue.service';
import { PaidCoupon } from '../models/paid-coupon';
import { environment } from '../../environments/environment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-adm-cash-out-history',
  templateUrl: './adm-cash-out-history.component.html',
  styleUrls: ['./adm-cash-out-history.component.css'],
})
export class AdmCashOutHistoryComponent implements OnInit {
  isSidebarCollapsed = false;
  title: string = 'Admin Cash Out History';

  revenues: Revenue[] = [];
  filteredRevenues: Revenue[] = [];
  searchQuery: string = '';
  selectedDate: string = '';
  paidCoupons: PaidCoupon[] = [];
  groupedCoupons: any[] = [];
  selectedRevenueId: number | null = null;
  isModalOpen: boolean = false;
  baseUrl = environment.apiUrl;
  showFilters = false;
  selectedRevenue: any = null;

  constructor(private revenueService: RevenueService) {}

  ngOnInit(): void {
    this.fetchRevenues();
  }

  onSidebarToggle(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  private fetchRevenues(): void {
    this.revenueService.getALL().subscribe(
      (data: Revenue[]) => {
        this.revenues = data;
        this.filteredRevenues = [...this.revenues]; // Initialize filteredRevenues immediately
        this.filterRevenues(); // Ensure filters are applied after data is fetched
      },
      (error) => {
        console.error('Error fetching revenues', error);
      }
    );
  }
  

  filterRevenues(): void {
    this.filteredRevenues = this.revenues.filter((revenue) => {
      const matchesSearch = revenue.businessName
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesDate =
        this.selectedDate === '' ||
        new Date(revenue.payDate).toISOString().slice(0, 10) ===
          this.selectedDate;

      return matchesSearch && matchesDate;
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.searchQuery = input.value;
      this.filterRevenues();
    }
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.selectedDate = input.value;
      this.filterRevenues();
    }
  }

  openModal(revenue: Revenue): void {
    this.selectedRevenue = revenue;
    this.fetchPaidCoupons(revenue.id);
    this.isModalOpen = true;
  }

  fetchPaidCoupons(revenueId: number): void {
    this.revenueService.getPaidCouponsByRevenueId(revenueId).subscribe(
      (data: PaidCoupon[]) => {
        this.paidCoupons = data;
        this.groupCoupons();
      },
      (error) => {
        console.error('Error fetching paid coupons:', error);
      }
    );
  }
  
  groupCoupons(): void {
    const couponMap = new Map();
  
    for (const coupon of this.paidCoupons) {
      const key = coupon.packageName;
      if (couponMap.has(key)) {
        couponMap.get(key).quantity += 1;
      } else {
        couponMap.set(key, { ...coupon, quantity: 1 });
      }
    }
  
    this.groupedCoupons = Array.from(couponMap.values());
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.paidCoupons = [];
    this.groupedCoupons = [];
    this.selectedRevenue = null;
  }

  exportTableToPDF() {
    const reportSection = document.querySelector(
      '.report-section'
    ) as HTMLElement;

    if (!reportSection) {
      console.error('Report section not found.');
      return;
    }

    // Save the current display style
    const originalDisplay = reportSection.style.display;

    // Temporarily make the section visible
    reportSection.style.display = 'block';

    // Use html2canvas to capture the section
    html2canvas(reportSection, {
      useCORS: true,
      scale: 2,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Payment_Report.pdf');

        // Revert the display style
        reportSection.style.display = originalDisplay;
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);

        // Ensure the display style is reverted even if there’s an error
        reportSection.style.display = originalDisplay;
      });
  }

  exportToPDF() {
    const reportElement = document.querySelector('.report-model') as HTMLElement;  // Type assertion
    
    if (reportElement) {
      html2canvas(reportElement).then((canvas) => {
        console.log(canvas);

        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF();
        doc.addImage(imgData, 'PNG', 10, 10, 180, 160); 

        doc.save('report.pdf');
      });
    }
  }
}
