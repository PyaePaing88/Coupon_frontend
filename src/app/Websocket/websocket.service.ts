import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {Observable, Subject } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { LoggedUser } from '../models/logged-user';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private baseUrl=environment.apiUrl;
  private stompClient!: Client;
  private messageSubject = new Subject<string|any>();
  private user!: LoggedUser;

  constructor(private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
   
    const loggedUser = this.authService.getLoggedUser();
    if (loggedUser) {
      this.user = loggedUser;
      console.log('User ID:', this.user.id);
    } else {
      ('User is not logged in');
    }
    if (isPlatformBrowser(this.platformId)) {
     this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${this.baseUrl}ws`),
      reconnectDelay: 5000, 
      onConnect: () => this.onConnected(),
      onDisconnect: () => console.log('Disconnected from WebSocket'),
      onStompError: (frame) => console.error('STOMP Error:', frame),
      debug: (str) => console.log(str),
    });

    this.stompClient.activate(); 
  }
  }

        private onConnected() {
          console.log('Connected to WebSocket');
          this.stompClient.subscribe('/topic/messages', message => {
            console.log('Received:', message.body);
            this.messageSubject.next(message.body); 
          });
          this.myMessageSubcribe();
        }
  

        myMessageSubcribe() {
          this.stompClient.subscribe(`/queue/${this.user.id}`, message => {
            console.log('Received:', message.body);
            this.messageSubject.next(message.body); 
          });

        }

       
        public sendMessage(message: string) {
          if (this.stompClient.connected) {
            this.stompClient.publish({
              destination: '/app/send', // Matches @MessageMapping("/send") in Spring Boot
              body: JSON.stringify({ text: message }) // Convert to JSON
            });
          } else {
            console.warn('WebSocket is not connected yet.');
          }
        }

        // Get messages as an Observable (so components can subscribe)
        public getMessages(): Observable<string|any> {
          return this.messageSubject.asObservable();
        }

        // Disconnect WebSocket (optional)
        public disconnect() {
          if (this.stompClient) {
            this.stompClient.deactivate();
          }
        }

 
  subscribe(arg0: string, arg1: (message: any) => void) {
    throw new Error('Method not implemented.');
  }
}