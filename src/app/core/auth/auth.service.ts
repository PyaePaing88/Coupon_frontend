import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoggedUser } from '../../models/logged-user';
import { ClientType } from '../../models/ClientType';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
//import { WebsocketService } from '../../Websocket/websocket.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private baseUrl = environment.apiUrl;

  private loggdUser: LoggedUser = new LoggedUser(
    0,
    ClientType.CUSTOMER,
    '',
    ''
  );

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private toster: ToastrService,
  ) 
  {}
  platformId = inject(PLATFORM_ID);
  getToken(): string | null {
    // Use inject(PLATFORM_ID) and check if in browse

    if (isPlatformBrowser(this.platformId)) {
      // Safely access localStorage only in the browser
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (token) {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.logout();
      } else {
        return true;
      }
    }
    return false; // Check token validity
  }

  getRoles(): string {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token); // Decode the token
      return decodedToken.roles; // Extract roles from the decoded token (or return an empty array if no roles)
    }
    return ''; // If no token is available, return an empty array
  }

  getLoggedUser(): LoggedUser |null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const  user= new LoggedUser(decodedToken.id,decodedToken.roles,decodedToken.sub,"");
      return user;
      // Extract roles from the decoded token (or return an empty array if no roles)
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Safely access localStorage only in the browser
      localStorage.removeItem('token');
    }

    this.router.navigate(['login']);
  }

  public login(loggedUser: LoggedUser): Observable<any> {
    //this.websocketService.connect();
    return this.httpClient.post<LoggedUser>(
      `${this.baseUrl}user/loginUser`,
      loggedUser,
      { withCredentials: true }
    );
  }

  // public logOut():Observable<any>{

  //   return this.httpClient.post<any>("http://localhost:8080/login/logOut",{withCredentials:true});
  // }

  public ifLoggdIn(state: any): void {
    const token = this.getToken();
    if (!token) {
      this.toster.error('Please login to continue', 'Error');
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    }
  }

  public ifLoggdOut(l: LoggedUser) {
    this.loggdUser = l;
  }

  // public getLoggduser() {
  //   return this.loggdUser;
  // }

  // public get loggeduser(): LoggedUser {
  //   return this.loggdUser;
  // }

  public set setLoggedUser(loggedUser: LoggedUser) {
    this.loggdUser = loggedUser;
  }
  getOTP(email:string):Observable<any>{
    return this.httpClient.get(`${this.baseUrl}user/otp/getOTP/${email}`);
  }

  verifyOTP(data: { email: string, otp: number }): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}user/otp/verify`, data);
  }
  
  changePassword(data: { email: string, password: string }): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}user/otp/forgetpassowrd`, data);
  }
  
}
