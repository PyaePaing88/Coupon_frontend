import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import { AuthService } from '../core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-business-password-reset',
  templateUrl: './business-password-reset.component.html',
  styleUrls: ['./business-password-reset.component.css'],
})
export class BusinessPasswordResetComponent implements OnInit {
  resetPasswordForm: FormGroup;
  userId: number = 0;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    // Fetch the logged-in user ID from AuthService
      const user=this.authService.getLoggedUser()
    if (user) {
      this.userId = user.id;
    } else {
      console.error('User is null');
    }
    console.log(this.userId);
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: FormGroup) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { password } = this.resetPasswordForm.value;

      this.userService.resetPassword(this.userId, password).subscribe({
        next: (response: string) => {
          this.toastr.success(response, 'Success');
          this.router.navigate(['/Business/create']); // Navigate to another page
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(
            'Failed to reset password. Please try again.',
            'Error'
          );
        },
      });
    }
  }
}
