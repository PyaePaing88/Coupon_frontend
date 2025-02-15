import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { PurchaseRequest } from '../models/purchase-request';
import { PaymentService } from '../Services/payment.service';
import { Packages } from '../models/package-model';
import { PurchaseDTO } from '../models/purchase-dto';
import { PackageDTO } from '../models/package-dto';
import { ToastrService } from 'ngx-toastr';
import { PaymentMethodService } from '../Services/payment-method.service';
import { PaymentMethod } from '../models/payment-method';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cus-cart-payment',
  templateUrl: './cus-cart-payment.component.html',
  styleUrl: './cus-cart-payment.component.css',
})
export class CusCartPaymentComponent {
  userId: number = 0;
  cartItems: any[] = [];
  totalAmount: number = 0; // Total amount of all selected packages

  paymentType: string = '';
  paymentMethods: PaymentMethod[] = [];

  baseUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private paymentmethodService: PaymentMethodService
  ) {}

  qrCode: string = 'assets/image/payment/KBZ_pay.png'; // Default QR Code for KBZ Pay

  ngOnInit() {
    const user = this.authService.getLoggedUser();
    if (user) {
      this.userId = user.id;
    } else {
      console.error('User is not logged in.'); 
    }
    this.loadPaymentMethods();

    // Subscribe to query parameters to get the cart items
    this.route.queryParams.subscribe((params) => {
      if (params['items']) {
        this.cartItems = JSON.parse(decodeURIComponent(params['items']));
        this.calculateTotalAmount(); // Calculate the total amount
      }
    });
  }

  loadPaymentMethods(): void {
    this.paymentmethodService.getPaymentMethods().subscribe((methods) => {
      this.paymentMethods = methods;
      if (this.paymentMethods.length) {
        this.paymentType = this.paymentMethods[0].paymentType;
        this.qrCode = this.paymentMethods[0].image;
      }
    });
  }

  changeQR(paymentType: string): void {
    this.paymentType = paymentType;
    const selectedMethod = this.paymentMethods.find(
      (method) => method.paymentType === paymentType
    );

    if (selectedMethod) {
      this.qrCode = selectedMethod.image;
      console.log('QR Code updated to:', this.qrCode);
    } else {
      console.error('Payment type not found:', paymentType); // Debug log
    }
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce(
      (sum, item) => sum + item.packageDetails.unit_price * item.unit_quantity,
      0
    );
  }

  submitPayment(): void {
    if (!this.paymentType) {
      this.toastr.error('Please select a payment type.', 'Error');
      return;
    }

    const totalQuantity = this.cartItems.reduce(
      (sum, item) => sum + item.unit_quantity,
      0
    );

    const transactionId = (
      document.getElementById('transaction-id') as HTMLInputElement
    ).value;

    const purchaseDTO: PurchaseDTO = {
      total_amount: this.totalAmount,
      total_quantity: totalQuantity,
      payment_type: this.paymentType, // Use validated payment type
      transaction_id: transactionId,
      user_id: this.userId,
    };

    const selectedPackages: PackageDTO[] = this.cartItems.map((item) => ({
      id: item.packageDetails.id,
      name: item.packageDetails.name,
      unit_price: item.packageDetails.unit_price,
      quantity: item.packageDetails.quantity,
      expired_date: item.packageDetails.expired_date,
      selected_quantity: item.unit_quantity,
    }));

    const purchaseRequest: PurchaseRequest = {
      purchaseDTO,
      selectedPackages,
    };

    this.paymentService.savePurchase(purchaseRequest).subscribe(
      (response: string) => {
        console.log('Response from server:', response);
        this.toastr.success(
          'Payment was successful! Please wait for coupon',
          'Success'
        );
        this.router.navigate(['/my-coupon']);
      },
      (error) => {
        console.error('Error saving purchase:', error);
        this.toastr.error('Error saving payment. Please try again.', 'Error');
      }
    );
  }

  private getSelectedPaymentType(): string {
    const paymentOptions = document.getElementsByName(
      'payment-type'
    ) as NodeListOf<HTMLInputElement>;

    return (
      Array.from(paymentOptions).find((option) => option.checked)?.value || ''
    );
  }
}
