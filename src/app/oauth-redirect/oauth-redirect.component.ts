import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth-redirect',
  templateUrl: './oauth-redirect.component.html',
  styleUrl: './oauth-redirect.component.css',
})
export class OauthRedirectComponent implements OnInit {
  token: string = '';
  name: string = '';
  email: string = '';
  photo: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    // Retrieve query parameters
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.name = params['name'];
      this.email = params['email'];
      this.photo = params['photo'];

      // Optionally, store the token in localStorage or sessionStorage for future use
    });
  }
  gotoDefaultRoute() {
    if (this.token) {
      localStorage.setItem('token', this.token);
      this.router.navigate(['/login']);
    }
  }
}
