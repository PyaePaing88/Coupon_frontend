import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { UserService } from '../Services/user.service';
import { environment } from '../../environments/environment';
import { data } from 'jquery';
import { WebSocketService } from '../Websocket/websocket.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'], // Fixed `styleUrl` to `styleUrls`
})
export class NavigationComponent implements OnInit {
  mobileMenuOpen = false;
  showPopup = false;
  unreadCount: number = 0;
  userId: number = 0;
  userName: string = '';
  userEmail: string = '';
  profileImage: string | null = null;
  userDetails: any = null;
  private webSocketSubscription!: Subscription;
  baseUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private webSocketService: WebSocketService,
     private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getLoggedUser();
    if (user) {
      const user = this.authService.getLoggedUser();
      this.userId = user!.id;
      this.loadUserDetails();
      this.webSocketSubscription = this.webSocketService
          .getMessages()
          .subscribe((confirmedmessage: any) => {
            console.log('WebSocket Notification:', typeof confirmedmessage);
            try {
              const socketMessage = JSON.parse(confirmedmessage); 
              if(socketMessage.title=='notification'){
                console.log('Notification:', "got new notification");
              this.getUnreadCount();
              this.toastr.success("you have a new notification","Notification");
              }
            } catch (error) {
              console.log('Error parsing WebSocket message:', error);
            }
          });
          this.getUnreadCount();
    }
  }
  ngOnDestroy() {
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe();
    }
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
            this.profileImage =
              'http://localhost:8080/users_images/default.png'; // Fallback image
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

  isNotificationOpen = false;

  toggleNotification() {
    this.isNotificationOpen = !this.isNotificationOpen;
    this.getUnreadCount();
  }
}
