import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../Services/user.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrl: './business-profile.component.css',
})
export class BusinessProfileComponent {
  activeTab = 'account-general';

  // Profile fields
  userId: number = 0;
  userName: string = '';
  userEmail: string = '';
  profileImage: string | null = null;

  currentPassword: string = '';
  newPassword: string = '';
  repeatNewPassword: string = '';
  userDetails: any = null;

  baseUrl = environment.apiUrl;

  // Switch between tabs
  switchTab(tabId: string) {
    this.activeTab = tabId;
  }

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Capture 'id' from the URL
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userId');
      if (userId) {
        this.userId = +userId; // Convert 'id' to a number
        this.loadUserDetails();
      }
    });
  }

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
              'http://localhost:8080/users_images/default.png';
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

  // Handle photo upload
  photoPreview: string | null = null; // To display the selected image preview
  selectedPhoto: File | null = null; // To store the selected file

  onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle password change
  changePassword() {
    if (this.newPassword === this.repeatNewPassword) {
      const passwordData = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        confirmPassword: this.repeatNewPassword,
      };
      this.userService.changePassword(this.userId, passwordData).subscribe({
        next: (response) => {
          this.toastr.success('Password changed successfully!', 'Success');
          console.log('Password changed successfully:', response);
        },
      });
    } else {
      this.toastr.success('Password changed successfully!', 'Success');
      return;
    }
  }

  // Save profile changes
  saveChanges() {
    const updatedUserDetails = {
      id: this.userId,
      name: this.userDetails.name,
      phone: this.userDetails.phone,
      email: this.userDetails.email,
    };
    this.userService
      .updateUserDetails(this.userId, updatedUserDetails)
      .subscribe({
        next: (updatedUser) => {
          this.toastr.success('Profile updated successfully!', 'Success');
        },
        error: (error) => {
          this.toastr.error(
            'Error updating profile. Please try again.',
            'Error'
          );
        },
      });

    if (this.selectedPhoto) {
      this.userService.uploadPhoto(this.userId, this.selectedPhoto).subscribe({
        next: (response) => {
          this.toastr.success('Photo uploaded successfully!', 'Success');
        },
        error: (error) => {
          this.toastr.error(
            'Error uploading photo. Please try again.',
            'Error'
          );
        },
      });
    }
  }

  onSubmit() {
    if (this.selectedPhoto) {
      // Replace with actual user ID from authentication
      this.userService.uploadPhoto(this.userId, this.selectedPhoto).subscribe({
        next: (response) => {
          // Success message with Toastr
          this.toastr.success('Photo uploaded successfully!', 'Success');
        },
        error: (error) => {
          // Error message with Toastr
          this.toastr.error(
            'Error uploading photo. Please try again.',
            'Error'
          );
        },
      });
    }
  }
}
