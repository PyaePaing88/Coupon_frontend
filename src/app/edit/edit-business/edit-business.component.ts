import { Component } from '@angular/core';
import { Business } from '../../models/business';
import { BusinessService } from '../../Services/business.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { latLng } from 'leaflet';

@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.component.html',
  styleUrl: './edit-business.component.css',
})
export class EditBusinessComponent {
  business: Business = new Business();
  originalBusiness: Business = new Business();
  businessId!: number;
  categories: any[] = [];
  services: any[] = [];
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  baseUrl = environment.apiUrl;
  private map: any;
  private currentMarker: any;
  constructor(
    private route: ActivatedRoute,
    private service: BusinessService,
    private router: Router,
    private toastr: ToastrService // Toast service for notifications
  ) {}

  ngOnInit(): void {
    this.businessId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.businessId) {
      this.getBusinessById(this.businessId);
      console.log("this is bussinelat",this.business.latitude);
    } else {
      console.error('Invalid business ID');
    }
    this.getCategories();
    this.getServices();
  
  }

  getBusinessById(id: number): void {
    this.service.getBusinessById(id).subscribe(
      (data) => {
        if (data) {
          this.business = data;
          if (typeof window !== 'undefined' && this.business.latitude && this.business.longitude) {
            import('leaflet').then(L => {
              this.initMap(L);
            });
          }
        } else {
          console.log('Business not found');
        }
      },
      (error) => {
        console.error('Error fetching business data', error);
      }
    );
  }

  getCategories(): void {
    this.service.getCategory().subscribe((data) => {
      this.categories = data;
    });
  }

  getServices(): void {
    this.service.getService().subscribe((data) => {
      this.services = data;
    });
  }

  isCategorySelected(categoryId: number): boolean {
    return this.business.categoryId?.includes(categoryId) || false;
  }

  isServiceSelected(serviceId: number): boolean {
    return this.business.serviceId?.includes(serviceId) || false;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCategoryChange(event: any): void {
    const categoryId = Number(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      this.business.categoryId = [
        ...(this.business.categoryId || []),
        categoryId,
      ];
    } else {
      this.business.categoryId =
        this.business.categoryId?.filter((id) => id !== categoryId) || [];
    }
  }

  onServiceChange(event: any): void {
    const serviceId = Number(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      this.business.serviceId = [...(this.business.serviceId || []), serviceId];
    } else {
      this.business.serviceId =
        this.business.serviceId?.filter((id) => id !== serviceId) || [];
    }
  }

  resetForm(): void {
    this.business = { ...this.originalBusiness }; // Restore original data
    this.router.navigate(['/business-home']);
  }

  OnSubmit(): void {
    const formData = new FormData();
    formData.append('dto', JSON.stringify(this.business));

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.service.updateBusinessById(this.businessId, formData).subscribe(
      () => {
        this.toastr.success('Business updated successfully!');
        this.router.navigate(['/business-home']);
      },
      (error) => {
        console.error('Error updating business:', error);
        this.toastr.error('Error updating business. Please try again.');
      }
    );
  }
  private initMap(L:any): void {
    let businesLat=Number(this.business.latitude);
    let busineslog=Number(this.business.longitude);
    this.map = L.map('map').setView([businesLat, busineslog], 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: "./assets/image/logo/map-pin-svgrepo-com.svg", 
      iconSize: [40, 40], 
      iconAnchor: [20, 40], 
      popupAnchor: [0, -40] 
    });

    this.currentMarker = L.marker([businesLat, busineslog],{ icon: customIcon }).addTo(this.map)
    .bindPopup(`Previous Location: ${businesLat}, ${busineslog}`)
    .openPopup();

    this.map.on('click', (event: L.LeafletMouseEvent) => {
       const latlng  = event.latlng;
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
