import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { UserService } from '../Services/user.service';
import { environment } from '../../environments/environment';
import { Business } from '../models/business';
import { BusinessService } from '../Services/business.service';

@Component({
  selector: 'app-business-navigation',
  templateUrl: './business-navigation.component.html',
  styleUrl: './business-navigation.component.css',
})
export class BusinessNavigationComponent {
  mobileMenuOpen = false;
  showPopup = false;

  userId: number = 0;
  userName: string = '';
  userEmail: string = '';
  profileImage: string | null = null;
  userDetails: any = null;
  unreadCount: number = 0;
  baseUrl = environment.apiUrl;

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedUser();
    if (user) {
      this.userId = user.id;
    } else {
      console.error('User is not logged in.');
    }
    this.loadUserDetails();
    this.loadBusinessDetails(this.userId);
  }

  navigateToBusinessSale(businessId: number): void {
    this.router.navigate(['/business-sale', businessId]);
  }

  // Closes the mobile menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const sidebar = document.querySelector('.mobile-sidebar');
    const toggleCheckbox = document.querySelector('.mobile-menu-toggle input');

    if (
      this.mobileMenuOpen &&
      sidebar &&
      toggleCheckbox &&
      !sidebar.contains(event.target as Node) &&
      !(event.target as Node).isSameNode(toggleCheckbox)
    ) {
      this.mobileMenuOpen = false;
    }
  }

  // Toggles the profile popup
  togglePopup(): void {
    this.showPopup = !this.showPopup;
  }

  // Edits the user's profile
  edit(): void {
    alert('Navigating to edit profile page...');
    this.togglePopup();
    // Navigate to the edit profile route
    this.router.navigate(['/edit']);
  }

  // Loads user details
  loadUserDetails(): void {
    if (this.userId > 0) {
      this.userService.getUserDetailsById(this.userId).subscribe({
        next: (data) => {
          this.userDetails = data;
          this.userName = data.name;
          this.userEmail = data.email;

          // Check if the photo is present and not null
          if (data.photo) {
            this.profileImage = data.photo;
          } else {
            this.profileImage = this.baseUrl + 'users_images/default.png'; // Fallback image
          }
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
        },
      });
    } else {
      console.error('Invalid user ID. Cannot load user details.');
    }
  }

  // Logs the user out
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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
        } else {
          console.error('Business not found!');
        }
      },
      error: (err) => {
        console.error('Error loading business details:', err);
      },
    });
  }

  isNotificationOpen = false;

  toggleNotification() {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  private getUnreadCount(): void {
    this.userService.getUnreadNoti(this.userId).subscribe({
      next: (data) => {
        this.unreadCount = data.unread;
      },
      error: (err) => {
        console.error('Failed to fetch unread notification count', err);
      },
    });
  }
}
