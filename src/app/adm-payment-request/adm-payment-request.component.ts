import { Component } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import {
  PurchaseAndUserDTO,
  PurchaseService,
} from '../Services/purchase.service';
import { ToastrService } from 'ngx-toastr';
import { CouponService } from '../Services/coupon.service';
import { Coupon } from '../models/Coupon';
import { Purchase } from '../models/purchase';
import { PaymentMethodService } from '../Services/payment-method.service';
import { PaymentMethod } from '../models/payment-method';
import { environment } from '../../environments/environment';
import { WebSocketService } from '../Websocket/websocket.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adm-payment-request',
  templateUrl: './adm-payment-request.component.html',
  styleUrl: './adm-payment-request.component.css',
})
export class AdmPaymentRequestComponent {
  isSidebarCollapsed = false;
  private webSocketSubscription!: Subscription;
  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  purchases: PurchaseAndUserDTO[] = [];
  isLoading = true;
  errorMessage = '';
  paymentType: string = 'KBZ Pay';
  paymentMethods: PaymentMethod[] = [];
  showFilters = false;
  filteredPurchases: PurchaseAndUserDTO[] = [];
  filters = {
    username: '',
    status: '',
    paymentType: '',
    requestDate: '',
  };

  baseUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private couponService: CouponService,
    private purchaseService: PurchaseService,
    private toastr: ToastrService,
    private webSocketService: WebSocketService,
    private paymentmethodService: PaymentMethodService
  ) {}

  ngOnInit(): void {
    this.fetchPurchases();
    this.loadPaymentMethods();
    // Initialize WebSocket and subscribe to notifications
    this.webSocketSubscription = this.webSocketService
      .getMessages()
      .subscribe((message: any) => {
        this.fetchPurchases();
        this.handleWebSocketMessage(message);
      });
  }
  ngOnDestroy() {
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe();
    }
  }

  fetchPurchases(): void {
    this.purchaseService.getAllPurchases().subscribe(
      (data: PurchaseAndUserDTO[]) => {
        this.purchases = data.sort((a, b) =>
          a.confirm === 'PENDING' ? -1 : b.confirm === 'PENDING' ? 1 : 0
        );
        this.filteredPurchases = [...this.purchases]; // Initialize filtered data
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load purchases.';
        this.isLoading = false;
      }
    );
  }

  applyFilters(): void {
    this.filteredPurchases = this.purchases
      .filter((purchase) => {
        const matchesUsername =
          !this.filters.username ||
          purchase.user_name
            .toLowerCase()
            .includes(this.filters.username.toLowerCase());

        const matchesStatus =
          !this.filters.status || purchase.confirm === this.filters.status;

        const matchesPaymentType =
          !this.filters.paymentType ||
          purchase.payment_type === this.filters.paymentType;

        const matchesRequestDate =
          !this.filters.requestDate ||
          (new Date(purchase.purchase_date).getFullYear() ===
            new Date(this.filters.requestDate).getFullYear() &&
            new Date(purchase.purchase_date).getMonth() ===
              new Date(this.filters.requestDate).getMonth());

        return (
          matchesUsername &&
          matchesStatus &&
          matchesPaymentType &&
          matchesRequestDate
        );
      })
      .sort((a, b) =>
        a.confirm === 'PENDING' ? -1 : b.confirm === 'PENDING' ? 1 : 0
      );
  }

  handleWebSocketMessage(message: string): void {
    // Display toast notification for WebSocket messages
    if (message) {
      this.toastr.info(message, 'New Notification');
      this.fetchPurchases();
    }
  }

  loadPaymentMethods(): void {
    this.paymentmethodService.getPaymentMethods().subscribe((methods) => {
      this.paymentMethods = methods;
      if (this.paymentMethods.length) {
        this.paymentType = this.paymentMethods[0].paymentType; // Set default selected payment type
      }
    });
    console.log(this.paymentMethods);
  }

  onAccept(purchaseId: number): void {
    this.isLoading = true;
    this.couponService.acceptPurchase(purchaseId).subscribe(
      (response) => {
        this.isLoading = false;
        this.fetchPurchases();
        this.toastr.success(response.message, 'Success');
      },
      (error) => {
        this.isLoading = false;
        this.toastr.error(
          error.error.message || 'Failed to accept purchase!',
          'Error'
        );
        console.log(error);
      }
    );
  }

  onDecline(purchaseId: number): void {
    this.isLoading = true;
    this.couponService.declinePurchase(purchaseId).subscribe(
      (response) => {
        this.isLoading = false;
        this.fetchPurchases();
        this.toastr.success(response.message, 'Success');
      },
      (error) => {
        this.isLoading = false;
        this.toastr.error(
          error.error.message || 'Failed to decline purchase!',
          'Error'
        );
        console.error(error);
      }
    );
  }

  coupons: Coupon[] = [];
  isModalOpen = false;
  error: string | null = null;
  selectedPayment: Purchase | null = null; // Selected payment details

  openCouponModal(purchase: PurchaseAndUserDTO): void {
    this.selectedPayment = {
      id: purchase.id,
      purchase_date: purchase.purchase_date,
      total_amount: purchase.total_amount,
      total_quantity: purchase.total_quantity,
      payment_type: purchase.payment_type,
      transaction_id: purchase.transaction_id,
      unitprice: 0, // Provide a default or dummy value
      image: '', // Provide a default or dummy value
    } as Purchase;

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
}
