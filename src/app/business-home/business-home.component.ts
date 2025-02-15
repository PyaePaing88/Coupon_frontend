import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { AuthService } from '../core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { BusinessService } from '../Services/business.service';
import { Packages } from '../models/package-model';
import { PackageService } from '../Services/package.service';
import { Review } from '../models/review.model';
import { ReviewService } from '../Services/review.service';
import { environment } from '../../environments/environment';
import { CouponService } from '../Services/coupon.service';
import { PlanService } from '../Services/plan.service';
import { BusinessPlan } from '../models/business-plan';

@Component({
  selector: 'app-business-home',
  templateUrl: './business-home.component.html',
  styleUrl: './business-home.component.css',
})
export class BusinessHomeComponent {
  userId: number = 0;
  userName: string = '';
  userEmail: string = '';
  profileImage: string | null = null;
  userDetails: any = null;

  totalReviwes: number | null = null;
  totalPackages: number | null = null;
  totalCouponSales: number | null = null;
  SaleCouponCount: number | null = null;

  // Business-related properties
  businessId: number = 0; // Holds the business ID for fetching details and submitting reviews
  businessName: string = '';
  businessBanner: string = '';
  businessPhone: string = '';
  businessEmail: string = '';
  businessLatitude: string = '';
  businessLongitude: string = '';
  businessAddress: string = '';
  businessCategories?: string[] = [];
  businessServices?: string[] = [];

  reviews: Review[] = [];
  stars: number[] = [1, 2, 3, 4, 5];
  averageRating: number = 0;
  totalRatings: number = 0;
  ratingBreakdown: { rating: number; count: number }[] = [];

  selectedPackage: any = null;
  isPopupVisible: boolean = false;
  baseUrl = environment.apiUrl;
  businessPlan: BusinessPlan | null = null;

  // couponSaleData: any[] = [];
  view: [number, number] = [300, 300];
  gradient = false;
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  colorScheme: Color = {
    domain: ['#1E90FF', '#4682B4', '#5F9EA0', '#87CEEB'],
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
  };

  startDate: string = new Date(new Date().setDate(new Date().getDate() - 7))
    .toISOString()
    .split('T')[0]; // Default: 7 days ago
  endDate: string = new Date().toISOString().split('T')[0]; // Default: today
  isDataAvailable: boolean = false;
  ticks = this.generateYAxisTicks();

  chartData: any[] = [];
  responseMessage: string = '';
  isOpen: boolean = false; // Initially, the business is open

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private businessService: BusinessService,
    private toastr: ToastrService,
    private service: PackageService,
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private couponService: CouponService,
    private cdr: ChangeDetectorRef,
    private planService: PlanService
  ) {}

  @ViewChild('packagesSection') packagesSection!: ElementRef;

  // Scroll to the packages section
  scrollToPackages() {
    this.packagesSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  ngOnInit(): void {
    // Initialize user ID and load user details
    const user = this.authService.getLoggedUser();
    if (user) {
      this.userId = user.id;
      this.loadBusinessDetails(this.userId);
      this.loadPackagesByBusinessId();
      this.fetchReviewsByBusinessId();
      this.getPackageCount();
      this.getReviewCount();
      this.getCouponCount();
      this.fetchChartData();
      this.generateYAxisTicks();
      this.onResize();
    } else {
      console.error('User is null');
    }
  }

  navigateToBusinessSale(businessId: number): void {
    this.router.navigate(['/business-sale', businessId]);
  }

  logout(): void {
    this.authService.logout();
  }

  loadBusinessDetails(userId: number): void {
    this.businessService.getBusinessbyUserId(userId).subscribe({
      next: (business) => {
        if (business) {
          this.businessId = business.id;
          this.businessName = business.name;
          this.businessBanner = business.image;
          this.businessPhone = business.phone;
          this.businessEmail = business.email;
          this.businessLatitude = business.latitude;
          this.businessLongitude = business.longitude;
          this.businessAddress = business.address;
          this.businessCategories = business.categoryName;
          this.businessServices = business.serviceName;

          this.loadPackagesByBusinessId();
          this.fetchReviewsByBusinessId();
          this.getPackageCount();
          this.getReviewCount();
          this.getCouponCount();
          this.fetchChartData();
          this.fetchBusinessPlan();
        } else {
          console.error('Business not found!');
        }
      },
      error: (err) => {
        console.error('Error loading business details:', err);
      },
    });
  }

  isSidebarCollapsed = false;
  title: any;
  isDeleting: boolean = false;
  message: string = '';
  messageType: string = '';

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  expandedIndex: number | null = null;

  toggleDescription(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  packages: Packages[] = [];

  isExpired(expiredDate: string): boolean {
    const currentDate = new Date();
    const expirationDate = new Date(expiredDate);
    return expirationDate < currentDate;
  }

  loadPackagesByBusinessId(): void {
    this.service.findBybusinessId(this.businessId).subscribe(
      (packages) => {
        this.packages = packages;
      },
      (error) => {
        console.error('Error loading packages:', error);
      }
    );
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this package?')) {
      this.isDeleting = true;
      this.service.softDeletePackage(id).subscribe(
        (response: string) => {
          console.log('Package deleted successfully:', response);
          console.log('Package deleted successfully:', response);
          this.packages = this.packages.filter((pkg) => pkg.id !== id);
          this.isDeleting = false;
          this.message = 'Package deleted successfully';
          this.messageType = 'success';
        },
        (error) => {
          console.error('Error while deleting:', error);
          this.isDeleting = false;
          this.message = 'Error deleting package';
          this.messageType = 'error';
        }
      );
    }
  }
  // Load packages associated with a business

  openBuyNowPopup(packages: any): void {
    this.selectedPackage = { ...packages, selectedQuantity: 1 };
    this.isPopupVisible = true;

    // Fetch sale coupon count for the selected package
    this.getConfirmCouponsByPacckageId(packages.id);
  }

  closeBuyNowPopup(): void {
    this.isPopupVisible = false;
  }

  fetchReviewsByBusinessId(): void {
    this.reviewService.getReviewsByBusinessId(this.businessId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.calculateAverageRating();
        this.calculateRatingBreakdown();
      },
      error: (err) => {
        console.error('Error fetching reviews: ', err);
      },
    });
  }

  calculateAverageRating(): void {
    if (this.reviews?.length === 0) {
      this.averageRating = 0;
      this.totalRatings = 0;
      return;
    }
    const totalRating = this.reviews?.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.averageRating = totalRating / this.reviews?.length;
    this.totalRatings = this.reviews?.length;
  }

  calculateRatingBreakdown(): void {
    this.ratingBreakdown = this.stars?.map((star) => ({
      rating: star,
      count: this.reviews?.filter((review) => review.rating === star).length,
    }));
  }

  isModalVisible = false;

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
  }

  getPackageCount(): void {
    this.service.countPackageByBusinessId(this.businessId).subscribe(
      (data) => {
        this.totalPackages = data;
      },
      (error) => {
        console.error('Error fetching package count', error);
      }
    );
  }

  getReviewCount(): void {
    this.reviewService.countReviewsByBusinessId(this.businessId).subscribe(
      (count) => {
        this.totalReviwes = count; // Store the review count
      },
      (error) => {
        console.error('Error fetching review count:', error);
      }
    );
  }

  getCouponCount(): void {
    this.reviewService
      .countConfirmedCouponsByBusinessId(this.businessId)
      .subscribe({
        next: (data: number) => {
          this.totalCouponSales = data;
          console.log('Coupon count:', data);
        },
        error: (err: any) => {
          console.error('Error fetching coupon count', err);
        },
      });
  }

  onDateChange(): void {
    this.fetchChartData();
    console.log('Start Date:', this.startDate);
    console.log('End Date:', this.endDate);
  }

  fetchChartData() {
    this.couponService
      .getCouponCountByBusiness(this.businessId, this.startDate, this.endDate)
      .subscribe(
        (data: any) => {
          console.log('Fetched chart data:', data);

          // Transform the data into chart-compatible format
          this.chartData = Object.entries(data).map(([key, value]) => ({
            name: key, // Use the date as the label
            value: value, // Use the sales count as the value
          }));

          console.log('Transformed chart data:', this.chartData);

          // Trigger change detection to update the chart
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching chart data:', error);
        }
      );
  }

  customYAxisTickFormatting(value: any): string {
    // Ensure only major numbers display
    return value;
  }

  chartOptions = {
    yAxis: {
      tickInterval: 10, // Decrease this value to reduce the space between ticks
      tickPadding: 5, // Reduces padding between ticks and axis labels
    },
  };

  generateYAxisTicks(): number[] {
    const min = 0; // Define your chart's minimum value
    const max = 10; // Define your chart's maximum value
    const interval = 1; // Step size between major ticks

    // Generate ticks with two intermediate lines
    const ticks = [];
    for (let i = min; i <= max; i += interval) {
      ticks.push(i);
      ticks.push(i + interval / 3); // First intermediate
      ticks.push(i + (2 * interval) / 3); // Second intermediate
    }
    return ticks.filter((tick) => tick <= max); // Ensure no overflow beyond max
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any): void {
    // Adjust view size based on window width
    const width = window.innerWidth;

    if (width < 768) {
      // For small screens (mobile/tablet), set smaller charts
      this.view = [300, 200];
    } else {
      // For larger screens (desktop), set larger charts
      this.view = [600, 300];
    }
  }

  updateBarChart(): void {
    // Logic to update the bar chart with chartData
    console.log('Updated chart data:', this.chartData);
  }

  onSelect(event: any): void {
    console.log('Bar Chart Event:', event);
  }

  getConfirmCouponsByPacckageId(packageId: number): void {
    this.couponService.getConfirmedCouponCountByPackageID(packageId).subscribe(
      (count) => {
        this.SaleCouponCount = count; // Store the coupon count from the API
      },
      (error) => {
        console.error('Error fetching coupon count', error);
      }
    );
  }

  fetchBusinessPlan(): void {
    this.planService.getBusinessPlanByBusinessId(this.businessId).subscribe(
      (data: BusinessPlan) => {
        this.businessPlan = data;
        console.log('max_package:', this.businessPlan.max_package);
      },
      (error) => {
        console.error('Error fetching business plan:', error);
      }
    );
  }

  isAddPackageButtonDisabled(): boolean {
    const limit = this.businessPlan?.max_package || 5; // Default to 5 if max_package is 0 or falsy
    return limit === this.totalPackages;
  }
  
}
