import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Transfer } from '../models/transfer';
import { AuthService } from '../core/auth/auth.service';
import { TransferService } from '../Services/transfer.service';
import { CouponService } from '../Services/coupon.service';
import { Qr } from '../models/qr';
import html2canvas from 'html2canvas';
import { environment } from '../../environments/environment';
import { Business } from '../models/business';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cus-receive-list',
  templateUrl: './cus-receive-list.component.html',
  styleUrl: './cus-receive-list.component.css',
})
export class CusReceiveListComponent {
  isDropdownVisible: boolean = false;

  receiver_id!: number;

  Dropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  receiveList: Transfer[] = [];
  Code: string | null = null;
  isUseModalOpen: boolean = false;
  selectedCoupon: any = null;

  baseUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private service: TransferService,
    private couponService: CouponService,
    private authservice: AuthService
  ) {
    const user = authservice.getLoggedUser();
    if (user) {
      this.receiver_id = user.id;
    } else {
      console.error('User is null');
    }
  }

  ngOnInit(): void {
    if (this.authservice.getToken()) {
      this.getReceiveList();
    }
  }

  getReceiveList(): void {
    this.service.showReceiveList(this.receiver_id).subscribe(
      (data: Transfer[]) => {
        const currentDate = new Date();
        this.receiveList = data.filter((receive) => {
          return (
            receive.expired_date &&
            new Date(receive.expired_date) >= currentDate
          );
        });
      },
      (error) => {
        console.error('Error fetching receive list', error);
        alert('An error occurred while fetching the receive list.');
      }
    );
  }

  onUseCoupon(coupon: any): void {
    this.isUseModalOpen = true;
    this.Code = null; // Reset the QR code
    this.selectedCoupon = coupon; // Store the selected coupon details

    console.log('Selected Coupon:', this.selectedCoupon); // Debugging
    console.log('Selected Coupon:', this.selectedCoupon.coupon_id); // Debugging

    this.couponService.getQRCode(this.selectedCoupon.coupon_id).subscribe(
      (qr: Qr) => {
        this.Code = qr.code; // Assign the QR code value
      },
      (error) => {
        console.error('Error fetching QR code:', error);
        this.Code = 'Error fetching the QR code.'; // Error handling
      }
    );
  }

  closeModal(): void {
    this.isUseModalOpen = false;
    this.Code = null;
  }

  @ViewChild('qrCodeContainer') qrCodeContainer!: ElementRef;

  saveQrCode(): void {
    const element = this.qrCodeContainer?.nativeElement;

    if (element) {
      setTimeout(() => {
        html2canvas(element, { useCORS: true, allowTaint: true })
          .then((canvas) => {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'qr-code.png';
            link.click();
          })
          .catch((error) => {
            console.error('Error saving QR code as image:', error);
          });
      }, 500); // Small delay to allow rendering
    } else {
      console.error('QR code container not found!');
    }
  }

  couponId: number = 0;
  selectedBusiness: Business | null = null; // Business details for the selected coupon
  isBusinessModalOpen = false; // Control modal visibility

  // Method to open the modal and fetch business details
  openBusinessModal(couponId: number) {
    this.isBusinessModalOpen = true;

    // Example: Fetch business details based on coupon ID
    this.fetchBusinessDetails(couponId);
  }

  fetchBusinessDetails(couponId: number) {
    this.couponService.getBusinessByCouponId(couponId).subscribe(
      (business) => {
        // Successfully retrieved business data
        this.selectedBusiness = business;
      },
      (error) => {
        // Handle any errors that occur during the HTTP request
        console.error('Error fetching business details:', error);
      }
    );
  }

  // Close the business modal
  closeBusinessModal() {
    this.isBusinessModalOpen = false;
    this.selectedBusiness = null;
  }

  isExpired(expiredDate: string | Date | null): boolean {
    if (!expiredDate) return false; // Handle null case

    const expiry = new Date(expiredDate);
    const today = new Date();

    // Calculate today - 3 days
    today.setDate(today.getDate() - 3);

    return expiry <= today;
  }

  isExpiringSoon(expiredDate: string | Date | null): boolean {
    if (!expiredDate) return false;

    const expiry = new Date(expiredDate);
    const today = new Date();

    // Set both dates to midnight to avoid time mismatches
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    // Calculate the 3-day warning period
    const threeDaysBeforeExpiry = new Date(expiry);
    threeDaysBeforeExpiry.setDate(expiry.getDate() - 3);

    return today >= threeDaysBeforeExpiry && today < expiry;
  }
}
