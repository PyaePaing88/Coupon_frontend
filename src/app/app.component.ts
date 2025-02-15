import { Component } from '@angular/core';
import { WebSocketService } from './Websocket/websocket.service';
import { AuthService } from './core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cupon';
  // private webSocketSubscription!: Subscription;

  // constructor(private webSocketService: WebSocketService,
  //    private authService: AuthService,
  //    private tost: ToastrService,
  // ) {}
  // ngOnInit(): void {
  //   if (this.authService.getToken()) {
  //     this.webSocketSubscription =  this.webSocketService.getMessages().subscribe((message:any) => {
  //       this.tost.success(message);
  //     });
  //   }
  // }
  // ngOnDestroy() {
  //   if (this.webSocketSubscription) {
  //     this.webSocketSubscription.unsubscribe();
  //   }
  //   console.log("app.component.ts was destory");
  // }
  
}
