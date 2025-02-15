import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl=environment.apiUrl;
  private apiUrl = `${this.baseUrl}api/feedback`;  // Adjust the backend URL as needed
private abiUrl = `${this.baseUrl}api/feedback/list`;

  constructor(private http: HttpClient) { }

  submitFeedback(feedbackDTO: any): Observable<any> {
    return this.http.post(this.apiUrl, feedbackDTO);
  }

getFeedbackList(): Observable<Feedback[]> {
  return this.http.get<Feedback[]>(this.abiUrl);
}
 
}
