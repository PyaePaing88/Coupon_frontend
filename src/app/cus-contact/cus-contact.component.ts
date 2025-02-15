import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Feedback } from '../models/feedback';
import { AuthService } from '../core/auth/auth.service';
import { FeedbackService } from '../Services/feedback.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contact',
  templateUrl: './cus-contact.component.html',
  styleUrls: ['./cus-contact.component.css'],
})
export class ContactComponent {
  feedback: Feedback = new Feedback();

  constructor(
    private toastr: ToastrService,
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Simulate fetching the user ID (you can replace this with actual logic)
    const user = this.authService.getLoggedUser();
    if (user) {
      this.feedback.userId = user.id;
    } else {
      console.error('User is not logged in');
    }
  }

  onSubmit(contactForm: any): void {
    this.checkLogin();
    if (contactForm.valid) {
      this.feedbackService.submitFeedback(this.feedback).subscribe({
        next: (response) => {
          console.log('Feedback submitted successfully', response);
          // Show success toastr notification
          this.toastr.success(
            'Your feedback has been submitted successfully!',
            'Success'
          );
          // Reset form
          contactForm.reset();
          // Reset the feedback object to clear form values
          this.feedback = new Feedback();
        },
        error: (err) => {
          console.error('Error submitting feedback', err);
          // Show error toastr notification
          this.toastr.error(
            'Something went wrong. Please try again later.',
            'Error'
          );
        },
      });
    }
  }
  private checkLogin(): void {
    const currentState = { url: this.router.url };
    this.authService.ifLoggdIn(currentState);
  }
}
