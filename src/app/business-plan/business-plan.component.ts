import { Component, OnInit } from '@angular/core';
import { Plan } from '../models/plan';
import { PlanService } from '../Services/plan.service';
import { PaymentMethodService } from '../Services/payment-method.service';
import { AuthService } from '../core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentMethod } from '../models/payment-method';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { BusinessPlan } from '../models/business-plan';

@Component({
  selector: 'app-business-plan',
  templateUrl: './business-plan.component.html',
  styleUrls: ['./business-plan.component.css'],
})
export class BusinessPlanComponent implements OnInit {
  userId: number = 0;
  businessId: number = 0;
  plans: Plan[] = [];
  businessPlan: BusinessPlan | null = null;
  showPaymentModal: boolean = false;
  selectedPlan: Plan | null = null;
  paymentType: string = '';
  transactionId: string = '';
  paymentMethods: PaymentMethod[] = [];
  qrCode: string = 'assets/image/payment/KBZ_pay.png'; // Default QR Code for KBZ Pay
  baseUrl = environment.apiUrl;

  constructor(
    private planService: PlanService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private paymentmethodService: PaymentMethodService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.businessId = +params['businessId'] || 0;
      if (this.businessId > 0) {
        this.fetchBusinessPlan(); // Fetch the business plan
      } else {
        console.error('Business ID is not set!');
      }
    });
    this.loadPaymentMethods();
    this.loadPlans(); // Load the paid plans
  }

  // Fetch the business plan based on the business ID
  fetchBusinessPlan(): void {
    this.planService.getBusinessPlanByBusinessId(this.businessId).subscribe(
      (data: BusinessPlan) => {
        this.businessPlan = data;
      },
      (error) => {
        console.error('Error fetching business plan:', error);
      }
    );
  }

  loadPlans(): void {
    this.planService.getAllPlans().subscribe(
      (data) => {
        this.plans = data;
      },
      (error) => {
        console.error('Error loading plans:', error);
      }
    );
  }

  openPaymentModal(plan: Plan): void {
    this.selectedPlan = plan;
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedPlan = null;
    this.paymentType = '';
    this.transactionId = '';
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
      console.error('Payment type not found:', paymentType);
    }
  }

  confirmPayment(): void {
    if (!this.paymentType || !this.transactionId || !this.selectedPlan) {
      this.toastr.error(
        'Please select a payment type and enter a transaction ID.'
      );
      return;
    }

    const payment = new BusinessPlan(
      this.selectedPlan.price,
      this.paymentType,
      this.transactionId,
      new Date().toISOString(),
      this.businessId,
      this.selectedPlan.id,
      0
    );

    console.log(this.businessId);

    this.planService.saveBusinessPlan(payment).subscribe({
      next: () => {
        this.toastr.success('Payment successful!');
        this.closePaymentModal();
        this.router.navigate(['/business-home']);
      },
      error: (error) => {
        console.error('Error processing payment:', error);
        this.toastr.error('Payment failed. Please try again.');
      },
    });
  }

  shouldHideUpgradeButton(plan: Plan): boolean {
    if (!this.businessPlan && plan.id === 1) {
      return true;
    }

    if (this.businessPlan) {
      return this.businessPlan.total_amount >= plan.price || plan.id === 1;
    }

    return false;
  }

  isSelected(plan: Plan): boolean {
    return this.selectedPlan?.id === plan.id;
  }
}
