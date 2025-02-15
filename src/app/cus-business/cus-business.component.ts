import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from '../Services/business.service';
import { PackageService } from '../Services/package.service';
import { ReviewService } from '../Services/review.service';
import { Review } from '../models/review.model'; // Assuming Review model exists
import { Packages } from '../models/package-model'; // Assuming Packages model exists
import { AuthService } from '../core/auth/auth.service';
import { environment } from '../../environments/environment';
import { Business } from '../models/business';
import { CouponService } from '../Services/coupon.service';
import { User } from '../models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cus-business',
  templateUrl: './cus-business.component.html',
  styleUrls: ['./cus-business.component.css'],
})
export class CusBusinessComponent implements OnInit {
  tabs = [
    { label: 'Packages' },
    { label: 'Services' },
    { label: 'Location' },
    { label: 'Review' },
  ];

  selectedTab: number = 0;
  reviewsVisible: boolean = false;

  businessId: number | null = null;
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
  review: Review = new Review();
  stars: number[] = [1, 2, 3, 4, 5];
  averageRating: number = 0;
  totalRatings: number = 0;

  ratingBreakdown: { rating: number; count: number }[] = [];
  packages: Packages[] = [];

  errorMessage: string = '';
  successMessage: string = '';

  baseUrl = environment.apiUrl;
  parseLat!:number;
  parseLog!:number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private businessService: BusinessService,
    private packageService: PackageService,
    private reviewService: ReviewService,
    private couponService: CouponService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.businessId = +id;
          this.loadBusinessDetails(this.businessId);
          this.fetchReviewsByBusinessId(this.businessId);
          this.loadPackagesByBusinessId(this.businessId);
          const user = this.authService.getLoggedUser();
          if (user) {
            this.review.userId = user.id;
          } else {
            console.error('User not found!');
          }
        }
      });
  }

  loadBusinessDetails(id: number): void {
    this.businessService.getBusinessById(id).subscribe((business) => {
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
        this.review.businessId = business.id;


      } else {
        console.error('Business not found!');
      }
    });
  }

  isExpired(expiredDate: string): boolean {
    const currentDate = new Date();
    const expirationDate = new Date(expiredDate);
    return expirationDate < currentDate;
  }

  loadPackagesByBusinessId(businessId: number): void {
    this.packageService.findBybusinessId(businessId).subscribe(
      (packages) => {
        this.packages = packages.filter(
          (pkg) => !this.isExpired(pkg.expired_date)
        );
      },
      (error) => {
        console.error('Error loading packages:', error);
      }
    );
  }

  fetchReviewsByBusinessId(businessId: number): void {
    this.reviewService.getReviewsByBusinessId(businessId).subscribe({
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
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      this.totalRatings = 0;
      return;
    }
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.averageRating = totalRating / this.reviews.length;
    this.totalRatings = this.reviews.length;
  }

  calculateRatingBreakdown(): void {
    this.ratingBreakdown = this.stars.map((star) => ({
      rating: star,
      count: this.reviews.filter((review) => review.rating === star).length,
    }));
  }

  toggleReviews(): void {
    this.reviewsVisible = !this.reviewsVisible;
  }

  setRating(rating: number): void {
    this.review.rating = rating;
  }

  submitReview(): void {
    this.checkLogin();
    if (this.review.userId && this.review.rating && this.review.message) {
      this.reviewService.addReview(this.review).subscribe({
        next: (response) => {
          this.toastr.success('Review submitted successfully!', 'Success'); // Success toast
          this.fetchReviewsByBusinessId(this.review.businessId); // Refresh reviews
          this.clearReviewForm();
        },
        error: (error) => {
          this.toastr.error(
            'Failed to save review. Please try again.',
            'Error'
          ); // Error toast
        },
      });
    } else {
      this.toastr.warning('Please fill out all the fields.', 'Warning'); // Warning toast
      console.error('Please fill out all the fields.');
    }
  }

  clearReviewForm(): void {
    this.review = new Review();
  }

  selectTab(index: number): void {
    this.selectedTab = index;
    if(this.selectedTab==2){
      console.log("dlkjgalsdkjglksadjglksdjlk",this.businessLatitude)
      this.parseLat=Number(this.businessLatitude);
      this.parseLog=Number(this.businessLongitude);
      console.log("dlkjgalsdkjgk",this.parseLat)
    }
  }

  handleAction(review: Review, action: string): void {
    if (!review || !action || !this.review.userId) {
      console.error('Invalid review, action, or user.');
      return;
    }

    this.reviewService
      .updateReviewAction(review.id, action, this.review.userId)
      .subscribe({
        next: () => {
          // Update the review's action locally for instant feedback
          review.action = action;
        },
        error: (err) => {
          console.error('Failed to perform action:', err);
        },
      });
  }
  
  private checkLogin(): void {
    const currentState = { url: this.router.url };
    this.authService.ifLoggdIn(currentState);
  }
}
