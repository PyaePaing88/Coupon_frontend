import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  emailForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  step = 1;
  isSendOtp = false;
  token = '';
  otpTimer!: number;
  timerInterval: any;

  constructor(
    private fb: FormBuilder,
    private autherSercive: AuthService,
    private toast: ToastrService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.maxLength(1)]],
      otp2: ['', [Validators.required, Validators.maxLength(1)]],
      otp3: ['', [Validators.required, Validators.maxLength(1)]],
      otp4: ['', [Validators.required, Validators.maxLength(1)]],
      otp5: ['', [Validators.required, Validators.maxLength(1)]],
      otp6: ['', [Validators.required, Validators.maxLength(1)]],
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    this.passwordForm
      .get('confirmPassword')
      ?.setValidators([
        Validators.required,
        this.passwordMatchValidator.bind(this),
      ]);
  }

  sendOtp(): void {
    if (this.emailForm.valid) {
      console.log('Sending OTP to:', this.emailForm.value.email);
      this.isSendOtp = true;
      this.autherSercive.getOTP(this.emailForm.value.email).subscribe(
        (data) => {
          const message: string = data.message;
          this.toast.success(message, 'OTP');
          this.otpTimer = data.time;
          console.log(this.otpTimer);
          this.startOtpTimer(this.otpTimer);
          this.step = 2;
        },
        (error) => {
          const message: string = error.message;
          this.toast.error(message, 'OTP');
          this.isSendOtp = false;
        }
      );
    }
  }

  verifyOtp(): void {
    if (this.otpForm.valid) {
      // Concatenate the OTP fields into a single string
      const otp =
        this.otpForm.value.otp1 +
        this.otpForm.value.otp2 +
        this.otpForm.value.otp3 +
        this.otpForm.value.otp4 +
        this.otpForm.value.otp5 +
        this.otpForm.value.otp6;
      console.log('Verifying OTP:', otp);

      // Prepare the data payload
      const data = {
        email: this.emailForm.value.email,
        otp: otp, // Use the concatenated OTP
      };

      // Call the verifyOTP method of the service
      this.autherSercive.verifyOTP(data).subscribe(
        (response) => {
          if (response.token) {
            this.token = response.token;
            this.toast.success('OTP verified', 'OTP');
            this.step = 3; // Move to the next step
          }
        },
        (error) => {
          const message: string = error.message || 'An error occurred';
          this.toast.error(message, 'OTP');
          this.isSendOtp = false;
        }
      );
    } else {
      this.toast.error('Please fill all OTP fields correctly.', 'OTP');
    }
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (
      this.passwordForm &&
      this.passwordForm.get('newPassword')?.value !== control.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const data = {
        email: this.emailForm.value.email,
        password: this.passwordForm.value.newPassword,
        token: this.token,
      };
      this.autherSercive.changePassword(data).subscribe(
        (data) => {
          const message: string = data.message;
          this.toast.success(message, 'OTP');
          this.router.navigate(['login']);
        },
        (error) => {
          const message: string = error.message;
          this.toast.error(message, 'OTP');
        }
      );
      console.log('Changing password');
    }
  }

  startOtpTimer(otpTimer: number): void {
    clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 800); // Decrement every second
  }

  moveFocus(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && index < 6) {
      const nextInput = document.getElementById(`otp-input${index + 1}`);
      (nextInput as HTMLInputElement)?.focus();
    } else if (input.value.length === 0 && index > 1) {
      const prevInput = document.getElementById(`otp-input${index - 1}`);
      (prevInput as HTMLInputElement)?.focus();
    }
  }
}
