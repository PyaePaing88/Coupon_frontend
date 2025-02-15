import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../Services/business.service';
import { PackageService } from '../Services/package.service';
import { ReviewService } from '../Services/review.service';
import { ActivatedRoute } from '@angular/router';
import { Packages } from '../models/package-model';
import { Review } from '../models/review.model';
import { UserService } from '../Services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-adm-business-details',
  templateUrl: './adm-business-details.component.html',
  styleUrls: ['./adm-business-details.component.css'], // Fixed typo in property name
})
export class AdmBusinessDetailsComponent implements OnInit {
  isSidebarCollapsed = false;
  selectedTab: string = 'packages'; // Default tab
  loading: boolean = false;
  error: string = '';

  // Business-related properties
  businessId: number = 0;
  businessName: string = '';
  businessBanner: string = '';
  businessPhone: string = '';
  businessEmail: string = '';
  businessLatitude: string = '';
  businessLongitude: string = '';
  businessAddress: string = '';
  businessCategories?: string[];
  businessServices?: string[];

  // User-related properties
  userId: number = 1; // Replace with actual user ID retrieval logic
  userName: string = '';
  userEmail: string = '';
  profileImage: string = '';

  // Rating and Review properties
  reviews: Review[] = [];
  averageRating: number = 0;
  totalRatings: number = 0;
  ratingBreakdown: { rating: number; count: number }[] = [];
  stars: number[] = [1, 2, 3, 4, 5];

  // Package-related properties
  packages: Packages[] = [];

  // Modal state
  isModalVisible = false;

  baseUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private packageService: PackageService,
    private reviewService: ReviewService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.businessId = +id; // Convert 'id' to a number
        this.loadBusinessDetails();
        this.loadPackagesByBusinessId();
        this.loadUserDetails();
        this.fetchReviewsByBusinessId();
      }
    });
  }

  onSidebarToggle(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  loadBusinessDetails(): void {
    this.businessService.getBusinessById(this.businessId).subscribe(
      (business) => {
        if (business) {
          this.businessName = business.name;
          this.businessBanner = business.image;
          this.businessPhone = business.phone;
          this.businessEmail = business.email;
          this.businessLatitude = business.latitude;
          this.businessLongitude = business.longitude;
          this.businessAddress = business.address;
          this.businessCategories = business.categoryName;
          this.businessServices = business.serviceName;
        } else {
          console.error('Business not found!');
        }
      },
      (error) => {
        console.error('Error fetching business details:', error);
      }
    );
  }

  loadPackagesByBusinessId(): void {
    this.packageService.findBybusinessId(this.businessId).subscribe(
      (packages) => {
        this.packages = packages;
      },
      (error) => {
        console.error('Error loading packages:', error);
      }
    );
  }

  loadUserDetails(): void {
    if (this.userId > 0) {
      this.userService.getUserDetailsById(this.userId).subscribe(
        (data) => {
          this.userName = data.name;
          this.profileImage = data.photo
            ? `this.baseUrl${data.photo}`
            : this.baseUrl + 'users_images/default.png';
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('Invalid user ID. Cannot load user details.');
    }
  }

  fetchReviewsByBusinessId(): void {
    this.reviewService.getReviewsByBusinessId(this.businessId).subscribe(
      (reviews) => {
        this.reviews = reviews;
        this.calculateAverageRating();
        this.calculateRatingBreakdown();
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
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

  isExpired(expiredDate: string): boolean {
    const currentDate = new Date();
    const expirationDate = new Date(expiredDate);
    return expirationDate < currentDate;
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible;
  }
}
