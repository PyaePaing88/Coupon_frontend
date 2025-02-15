import { Component, Input, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-location',
  templateUrl: './show-location.component.html',
  styleUrls: ['./show-location.component.css']
})
export class ShowLocationComponent implements OnInit {
  private map: any;  

  @Input() latitude!:number;
  @Input() longitude!:number;
   

  ngOnInit(): void {

    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        this.map = L.map('map').setView([this.latitude, this.longitude], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        const svg = `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <circle cx="25" cy="25" r="15" fill="red">
    <animate attributeName="r" from="15" to="20" dur="1s" repeatCount="indefinite" />
    <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
  </circle>
  <circle cx="25" cy="25" r="5" fill="white" stroke="red" stroke-width="2"/>
</svg>
`;

const encodedSVG = `data:image/svg+xml;base64,${btoa(svg)}`;

        const customIcon = L.icon({
          iconUrl: "./assets/image/logo/aniMaker.svg", 
          iconSize: [38, 70], 
          iconAnchor: [19, 70], 
          popupAnchor: [0, -75] 
        });

        L.marker([this.latitude, this.longitude],{ icon: customIcon })
          .addTo(this.map)
          .bindPopup('Click to open in Google Maps')
          .on('click', () => this.redirectToGoogleMaps());
      });
    }
  }

  private redirectToGoogleMaps(): void {
    const googleMapsUrl = `https://www.google.com/maps?q=${this.latitude},${this.longitude}`;
    window.open(googleMapsUrl, '_blank'); 
  }
}
