import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AcceptService {
  private baseUrl=environment.apiUrl;
  private stompClient!: Client;
  private messageSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  private userId: string = ''; // Store the user ID to subscribe to the correct queue

  constructor(private authService: AuthService) {
    // Initialize userId from the authentication service or local storage
    this.userId = this.authService.getLoggedUser();
    console.log('User ID:', this.userId); // Log the user ID to ensure it's being retrieved correctly
  }

  ngOnInit(): void {
    if (this.userId) {
      this.connect(); // Proceed with connection only if userId is available
    } else {
      console.error('User ID is not available!');
    }
  }

  public connect(): void {
    if (!this.userId) {
      console.error('User ID is not available!');
      return;
    }

    const socket = new SockJS(`${this.baseUrl}ws`);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str), // Debugging WebSocket connection
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket!', frame);
      this.subscribeToAccept();
    };

    this.stompClient.onStompError = (error) => {
      console.error('WebSocket error:', error);
    };

    this.stompClient.activate();
  }

  private subscribeToAccept(): void {
    // Subscribe to user-specific queue
    if (!this.userId) {
      console.error('Cannot subscribe. User ID is not set.');
      return;
    }

    this.stompClient.subscribe(`/user/${this.userId}/usecoupon`, (message: IMessage) => {
      console.log('Received WebSocket message:', message);

      console.log('Des uservid:', this.userId);

      // Check if the message body is valid and handle it
      if (message.body) {
        this.messageSubject.next(message.body); // Pass message body to BehaviorSubject
      } else {
        console.log('Received an empty or invalid message.');
      }
    });
  }

  public receiveMessage(): Observable<string | null> {
    return this.messageSubject.asObservable();
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('Disconnected from WebSocket');
    }
  }
}
