import { Component, HostListener } from '@angular/core';
import { Service } from '../models/service';
import { BusinessService } from '../Services/business.service';

@Component({
  selector: 'app-adm-servicelist',
  templateUrl: './adm-servicelist.component.html',
  styleUrl: './adm-servicelist.component.css',
})
export class AdmServicelistComponent {
  services: Service[] = [];
  newService: Service = new Service(0, '',false); // Initial empty service for adding
  selectedService: Service | null = null; // For editing

  isDropdownVisible: boolean = false;

  Dropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  // Close the dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown');
    if (dropdown && !dropdown.contains(target)) {
      this.isDropdownVisible = false;
    }
  }

  isSidebarCollapsed = false;
  title: any;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  showService: Service[] = [];

  serviceToDelete: any = null;

  constructor(private service: BusinessService) {}

  fetchServices() {
    this.service.getService().subscribe(
      (data) => {
        this.showService = data; // Assign the fetched categories to the showCategory variable
      },
      (error) => {
        console.log('Error fetching services: ', error);
      }
    );
  }

  openEditServiceModal(service: Service ): void {
      this.selectedService = { ...service }; // Clone category for editing
    }
  
    // Close Modal
    closeEditServiceModal(): void {
      this.selectedService = null; // Clear selected category
    }
  
    updateService(): void {
      if (this.selectedService) {
        this.service.updateService(this.selectedService.id, this.selectedService).subscribe(
          (updatedService) => {
            const index = this.services.findIndex((cat) => cat.id === updatedService.id);
            this.fetchServices();
  
            if (index !== -1) {
              this.services[index] = updatedService;
            }
            this.selectedService = null; // Clear selected service after saving
          },
          (error) => {
            console.error('Error updating service:', error);
          }
        );
      }
    }
  
    confirmDeleteService(service: any) {
      this.serviceToDelete = service; // Set the service to delete
    }
  
    deleteService(id: number) {
      this.service.deleteService(id).subscribe(
        () => {
          console.log('Service deleted successfully');
          // Fetch the updated service list
          this.fetchServices();
          this.serviceToDelete = null; // Reset the modal
        },
        (error) => {
          console.error('Error deleting service:', error);
          alert('Failed to delete the service. Please try again.');
          this.serviceToDelete = null; // Reset the modal
        }
      );
    }
    
    
  
    cancelDelete() {
      this.serviceToDelete = null; // Close the delete modal without deleting
    }

  ngOnInit(): void {
    this.fetchServices();
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
