import { ChangeDetectorRef, Component } from '@angular/core';
import { NotificationService } from '../Services/notification.service';
import { MyNotification } from '../models/my-notification';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { UsedConpon } from '../models/used-conpon';
import { environment } from '../../environments/environment';
import { NotificationStatus } from '../models/notification-status';
import { WebSocketService } from '../Websocket/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  private webSocketSubscription: Subscription;
  errorMessage!: string;
  usedCoupon!: UsedConpon | null;
  baseUrl = environment.apiUrl;
  //notification!:MyNotification;
  notifications:MyNotification[] | null =null;
  notification!:MyNotification;
  userId!:number| null;
  constructor(private notificationService:NotificationService,private router:Router,
    private authService:AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private webSocketService: WebSocketService
  ){
   const loggedUser = authService.getLoggedUser();
   this.userId = loggedUser ? loggedUser.id : null;
   this.webSocketSubscription = this.webSocketService
          .getMessages()
          .subscribe((confirmedmessage: any) => {
            console.log('WebSocket Notification:', typeof confirmedmessage);
            try {
              const notification = JSON.parse(confirmedmessage);
              if(notification.title=='notification'){
                this.notification = notification.object;
                debugger;
                this.notifications!.unshift(this.notification);
              }
            } catch (error) {
              console.log('Error parsing WebSocket message:', error);
            }
          });
  }

  ngOnInit(): void {
    if (this.authService.getToken()) {
      console.log('dagdsads');
      if (this.userId !== null) {
        this.getNotification(this.userId);
      }
    }
  }

  ngOnDestroy() {
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe();
    }
  }

  getNotification(userId: number) {
    this.notificationService.getNotification(userId).subscribe(
      (data: MyNotification[]) => {     
              this.notifications = data.reverse();
       },
      (err) => {this.errorMessage=err.message;
         console.error('Error fetching notifications:', err.message);
       },
   );
  }
  deleteNotification(index: number,noti_id:number): void {
    this.notificationService.deleteNoti(noti_id).subscribe(
      () => {
        console.log(`Notification with ID ${noti_id} deleted successfully.`);
        this.notifications![index].notificationStatus = NotificationStatus.READ;
        this.changeDetectorRef.detectChanges();
        this.notifications!.splice(index, 1);
      },
      (error) => {
        console.error(
          `Failed to delete notification with ID ${noti_id}:`,
          error
        );
      }
    );
  }
  closeModal(): void {
    this.usedCoupon = null;
  }
  gotoTask(myObject:MyNotification,index:number): void {
    console.log(myObject.content.action)
    if(myObject.content.action==="readyUse"){ this.router.navigate(['my-coupon'], { queryParams: { object: myObject.content.object} });}
    debugger;
    if(myObject.content.action==="usedCoupon"){ 
      this.usedCoupon=JSON.parse(myObject.content.object);
      console.log("useed coupon ",this.usedCoupon);
    }
    this.makeRead(myObject.id,index);
  }
  makeRead(noti_id:number,index:number): void {
   // this.notifications!.splice(index, 1);
    this.notificationService.makeRead(noti_id).subscribe(
      () => {
        console.log(`Notification with ID ${noti_id} read successfully.`);
        this.notifications![index].notificationStatus = NotificationStatus.READ;
      this.changeDetectorRef.detectChanges(); 
      },
      (error) => {
        console.error(`Failed to read notification with ID ${noti_id}:`, error);
      }
    );
  }
}
