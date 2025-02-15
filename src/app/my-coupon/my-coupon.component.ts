import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TransferService } from '../Services/transfer.service';
import { AuthService } from '../core/auth/auth.service';
import { CouponService } from '../Services/coupon.service';
import { Qr } from '../models/qr';
import { Coupon } from '../models/Coupon';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../Services/user.service';
import { WebSocketService } from '../Websocket/websocket.service';
import html2canvas from 'html2canvas';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { notEqual } from 'node:assert';

@Component({
  selector: 'app-my-coupon',
  templateUrl: './my-coupon.component.html',
  styleUrls: ['./my-coupon.component.css'],
})
export class MyCouponComponent implements OnInit {
  isDropdownVisible: boolean = false;
  private webSocketSubscription!: Subscription;
  Dropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  showCoupon: Coupon[] = [];
  readycoupon!: Coupon | null;
  receiverEmail: string = '';
  isModalOpen: boolean = false;
  isUseModalOpen: boolean = false;
  Code: string | null = null;
  emailSuggestions: string[] = [];
  note: string  = '';
  filteredCoupons: Coupon[] = [];
  searchTerm: string = '';

  private userId: number = 0;

  baseUrl = environment.apiUrl;
  selectedCoupon: any = null;

  constructor(
    private service: TransferService,
    private couponService: CouponService,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UserService,
    private webSocketService: WebSocketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedUser();
    if (user) {
      const user = this.authService.getLoggedUser();
      if (user) {
        this.userId = user.id; // Initialize user ID
        this.getCoupons();
      }

      this.webSocketSubscription = this.webSocketService
        .getMessages()
        .subscribe((confirmedmessage: any) => {
          console.log('WebSocket Notification:', typeof confirmedmessage);
          try {
            const websocketMessage = JSON.parse(confirmedmessage);
            if (websocketMessage.title === 'readyTouse') {
              this.readycoupon = websocketMessage.object;
            }
          } catch (error) {
            this.handleWebSocketMessage(confirmedmessage);
          }
        });

      this.route.queryParams.subscribe((queryParams) => {
        if (queryParams['object']) {
          this.readycoupon = JSON.parse(queryParams['object']); // This will now execute
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe();
    }
  }

  getCoupons(): void {
    this.service.showCouponsbyUser_id(this.userId).subscribe(
      (data: Coupon[]) => {
        const currentDate = new Date();
        this.showCoupon = data.filter(
          (coupon) =>
            coupon.expired_date && new Date(coupon.expired_date) >= currentDate
        );
        this.filteredCoupons = [...this.showCoupon]; // Initialize filtered list
      },
      (error) => console.error('Error fetching coupons:', error)
    );
  }

  filterCoupons(): void {
    this.filteredCoupons = this.showCoupon.filter((coupon) =>
      coupon.packageName?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleWebSocketMessage(confirmedmessage: string): void {
    // Display toast notification for WebSocket messages
    if (confirmedmessage) {
      this.toastr.info(confirmedmessage, 'New Notification');
      this.getCoupons();
    }
  }

  onUseCoupon(coupon: any): void {
    this.isUseModalOpen = true;
    this.Code = null; // Reset the QR code
    this.selectedCoupon = coupon; // Store the selected coupon details

    console.log('Selected Coupon:', this.selectedCoupon); // Debugging

    this.couponService.getQRCode(coupon.id).subscribe(
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
    this.readycoupon = null;
    this.Code = null;
  }

  openTransferModal(coupon: Coupon): void {
    this.selectedCoupon = coupon;
    this.isModalOpen = true;
  }

  closeTransferModal(): void {
    this.isModalOpen = false;
    this.receiverEmail = '';
    this.selectedCoupon = null;
    this.emailSuggestions = [];
    this.note = '';
  }

  transferCoupon(): void {
    const user = this.authService.getLoggedUser();
    if (user) {
      const sender_id = user.id;
      const coupon_id = this.selectedCoupon.id;
      const note = this.note;

      this.service
        .transferCouponRequest(sender_id, this.receiverEmail, coupon_id, note)
        .subscribe(
          () => {
            this.toastr.success('Coupon transferred successfully!', 'Success');
            this.closeTransferModal();
            this.getCoupons();
          },
          (error) => {
            this.toastr.error(
              'An error occurred while transferring the coupon.',
              'Error'
            );
          }
        );
    } else {
      this.toastr.warning(
        'Please provide a valid email and select a coupon.',
        'Warning'
      );
    }
  }

  onEmailInput(): void {
    if (this.receiverEmail.trim()) {
      this.userService.getEmailSuggestions(this.receiverEmail).subscribe(
        (suggestions) => {
          this.emailSuggestions = suggestions;
        },
        (error) => {
          console.error('Failed to fetch email suggestions:', error);
          this.emailSuggestions = [];
        }
      );
    } else {
      this.emailSuggestions = [];
    }
  }

  selectEmail(email: string): void {
    this.receiverEmail = email;
    this.emailSuggestions = [];
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

  confrimTouse(id: number): void {
    console.log('confrimTouse clicked', id);
    const body = {
      couponId: id,
      userId: this.userId,
    };
    this.couponService.confrimTouse(body).subscribe({
      next: (coupon) => {
        this.readycoupon = null;
        this.toastr.success(coupon.message, 'Coupon');
      },
      error: (err) => {
        this.toastr.error(err.message, 'Coupon');
        console.error(err); // Log detailed error for debugging
      },
      complete: () => console.log('Coupon search completed'),
    });
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
