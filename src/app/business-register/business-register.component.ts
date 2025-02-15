import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserService } from '../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-business-register',
  templateUrl: './business-register.component.html',
  styleUrl: './business-register.component.css',
})
export class BusinessRegisterComponent {
  isSidebarCollapsed = false;
  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  registerForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private location: Location,
    private toast: ToastrService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['Coupon12345'],
      role: ['BUSINESS'], // Default role is set here
    });
  }

  ngOnInit(): void {
    console.log('RegisterComponent initialized');
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const user = {
        name: this.registerForm.value.username,
        phone: this.registerForm.value.phone,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role,
      };
      console.log(user);
      this.userService.registerUser(user).subscribe({
        next: (response: any) => {
          this.successMessage = 'Registration successful!';
          this.errorMessage = null;
          this.registerForm.reset();
          this.toast.success(
            'User registered successfully, please login',
            'Sign Up'
          );
          this.router.navigate(['adm-user-list']);
        },
        error: (error: any) => {
          // Specify 'any' explicitly for error as well
          this.toast.success(`${error.message}`, 'Sign Up');
          this.successMessage = null;
          this.errorMessage = 'Failed to register user. Please try again.';
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  onCancel() {
    this.location.back(); // Navigate back to the previous page
  }
}
