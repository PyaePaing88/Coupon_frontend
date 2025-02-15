import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-server-downpage',
  templateUrl: './server-downpage.component.html',
  styleUrl: './server-downpage.component.css'
})
export class ServerDownpageComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back(); // Navigates to the previous page
  }
}
