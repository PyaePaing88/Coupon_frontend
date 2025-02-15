import { Component } from '@angular/core';
import { Feedback } from '../models/feedback';
import { FeedbackService } from '../Services/feedback.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-adm-feedback',
  templateUrl: './adm-feedback.component.html',
  styleUrl: './adm-feedback.component.css',
})
export class AdmFeedbackComponent {
  isSidebarCollapsed = false;
  title: any;

  baseUrl = environment.apiUrl;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  expandedIndex: number | null = null;

  toggleMessage(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  feedbackList: Feedback[] = [];

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.getFeedbackList();
  }

  // Method to fetch feedback from the service
  getFeedbackList(): void {
    this.feedbackService.getFeedbackList().subscribe(
      (response: Feedback[]) => {
        this.feedbackList = response;
      },
      (error) => {
        console.error('Error fetching feedback list', error);
      }
    );
  }
}
