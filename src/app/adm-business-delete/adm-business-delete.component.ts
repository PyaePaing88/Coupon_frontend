import { Component } from '@angular/core';
import { Business } from '../models/business';
import { BusinessService } from '../Services/business.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-adm-business-delete',
  templateUrl: './adm-business-delete.component.html',
  styleUrl: './adm-business-delete.component.css',
})
export class AdmBusinessDeleteComponent {
  isSidebarCollapsed = false;
  deletedBusinesses: Business[] = [];
  baseUrl = environment.apiUrl;

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    this.loadDeletedBusinesses();
  }

  loadDeletedBusinesses(): void {
    this.businessService.getDeletedBusinesses().subscribe(
      (data) => {
        this.deletedBusinesses = data;
      },
      (error) => {
        console.error('Error fetching deleted businesses: ', error);
      }
    );
  }

  // Method to restore a business by ID
  restoreBusiness(businessId: number): void {
    this.businessService.restoreBusiness(businessId).subscribe({
      next: () => {
        this.loadDeletedBusinesses();
        console.log('Business restored successfully');
      },
      error: (err) => {
        console.error('Error restoring business:', err);
      },
    });
  }
}
