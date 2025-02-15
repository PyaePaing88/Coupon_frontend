import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

import { BusinessService } from '../../Services/business.service';
import { Category } from '../../models/category';
import { Business } from '../../models/business';
import { Service } from '../../models/service';
import { Location } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-create-business',
  templateUrl: './create-business.component.html',
  styleUrls: ['./create-business.component.css'],
})
export class CreateBusinessComponent implements OnInit {
  private map: any;
  private currentMarker: any;
  business: Business = new Business();
  categories: Category[] = [];
  selectedCategory: number[] = [];
  services: Service[] = [];
  selectedService: number[] = [];
  userId: number = 0;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private service: BusinessService,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchServices();
    const user = this.authService.getLoggedUser();
    if (user) {
      this.userId = user.id;
    } else {
      console.error('User is not logged in');
    }
    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        this.initMap(L);
      });
    }
  }

  fetchCategories(): void {
    this.service.getCategory().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.toastr.error('Error fetching categories', 'Error'); // Show error toast
      }
    );
  }

  fetchServices(): void {
    this.service.getService().subscribe(
      (data: Service[]) => {
        this.services = data;
      },
      (error) => {
        console.error('Error fetching services:', error);
        this.toastr.error('Error fetching services', 'Error'); // Show error toast
      }
    );
  }

  onCategoryChange(event: any): void {
    const categoryId = Number(event.target.value);
    if (event.target.checked) {
      this.selectedCategory.push(categoryId);
    } else {
      const index = this.selectedCategory.indexOf(categoryId);
      if (index !== -1) {
        this.selectedCategory.splice(index, 1);
      }
    }
  }

  onServiceChange(event: any): void {
    if (event.target.checked) {
      this.selectedService.push(Number(event.target.value));
    } else {
      const index = this.selectedService.indexOf(Number(event.target.value));
      if (index !== -1) {
        this.selectedService.splice(index, 1);
      }
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.business.categoryId = this.selectedCategory;
      this.business.serviceId = this.selectedService;

      // Set userId directly from the service
      this.business.user_id = this.userId; // Set userId directly

      if (this.selectedFile) {
        const formData = new FormData();
        formData.append(
          'dto',
          new Blob([JSON.stringify(this.business)], {
            type: 'application/json',
          })
        );
        formData.append('image', this.selectedFile);

        this.service.createBusiness(formData).subscribe(
          (response) => {
            console.log('Successfully created business:', response);
            this.toastr.success('Business created successfully!', 'Success');
            this.router.navigate(['/business-home']);
          },
          (error) => {
            console.log('Error creating business:', error);
            this.toastr.error('Error creating business', 'Error');
          }
        );
      }
    } else {
      console.log('Form is invalid');
      this.toastr.warning('Please fill out the form correctly.', 'Warning');
    }
  }
  private initMap(L:any): void {
    this.map = L.map('map').setView([16.807325, 96.168585], 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);


    const customIcon = L.icon({
      iconUrl: "./assets/image/logo/map-pin-svgrepo-com.svg", 
      iconSize: [40, 40], 
      iconAnchor: [20, 40], 
      popupAnchor: [0, -40] 
    });


    this.currentMarker = L.marker([16.807325, 96.168585],{ icon: customIcon }).addTo(this.map)
    .bindPopup('Select your location')
    .openPopup();

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const latlng = event.latlng;
      if (this.currentMarker) {
        this.currentMarker.setLatLng(latlng);
      } else {
        this.currentMarker = L.marker(latlng).addTo(this.map!);
      }
      this.currentMarker.bindPopup(`Coordinates: ${latlng.lat}, ${latlng.lng}`).openPopup();
      this.business.latitude = latlng.lat.toString();
      this.business.longitude = latlng.lng.toString();
    });
  }
  
}
