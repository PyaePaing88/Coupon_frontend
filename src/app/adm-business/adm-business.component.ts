import { Component, HostListener } from '@angular/core';
import { Business } from '../models/business';
import { BusinessService } from '../Services/business.service';
import { Service } from '../models/service';
import { Category } from '../models/category';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-adm-business',
  templateUrl: './adm-business.component.html',
  styleUrl: './adm-business.component.css',
})
export class AdmBusinessComponent {
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

  searchQuery: string = '';
  showBusiness: Business[] = [];
  filteredBusiness: Business[] = [];
  showService: Service[] = [];
  showCategory: Category[] = [];

  selectedCategory: string = '';
  selectedService: string = '';

  baseUrl = environment.apiUrl;
  isDeleting: boolean = false;
  message: string = '';
  messageType: string = '';

  constructor(private service: BusinessService) {}

  fetchBusiness() {
    this.service.getBusiness().subscribe(
      (data) => {
        this.showBusiness = data; // Assign the fetched categories to the showCategory variable
        this.filteredBusiness = [...this.showBusiness];
      },
      (error) => {
        console.log('Error fetching business: ', error);
      }
    );
  }

  fetchCategories() {
    this.service.getCategory().subscribe(
      (data) => {
        this.showCategory = data; // Assign the fetched categories to the showCategory variable
      },
      (error) => {
        console.log('Error fetching categories: ', error);
      }
    );
  }

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

  ngOnInit(): void {
    this.fetchBusiness();
    this.fetchCategories();
    this.fetchServices();
  }

  filterBusiness(): void {
    if (!this.searchQuery && !this.selectedCategory && !this.selectedService) {
      this.filteredBusiness = [...this.showBusiness]; // No filters, show all businesses
      return;
    }

    this.filteredBusiness = this.showBusiness.filter((business) => {
      const matchesSearch =
        business.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (business.categoryName &&
          business.categoryName.some((category: string) =>
            category.toLowerCase().includes(this.searchQuery.toLowerCase())
          )) ||
        (business.serviceName &&
          business.serviceName.some((service: string) =>
            service.toLowerCase().includes(this.searchQuery.toLowerCase())
          ));

      const matchesCategory =
        !this.selectedCategory ||
        (business.categoryName &&
          business.categoryName.some((category: string) =>
            category.toLowerCase().includes(this.selectedCategory.toLowerCase())
          ));

      const matchesService =
        !this.selectedService ||
        (business.serviceName &&
          business.serviceName.some((service: string) =>
            service.toLowerCase().includes(this.selectedService.toLowerCase())
          ));

      return matchesSearch && matchesCategory && matchesService;
    });
  }

  onCategoryChange(): void {
    this.filterBusiness();
  }

  onSearchChange(): void {
    this.filterBusiness();
  }

  onServiceChange(): void {
    this.filterBusiness();
  }


  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  dotsMenuOpenId: number | null = null;

  toggleDotsMenu(businessId: number): void {
    this.dotsMenuOpenId =
      this.dotsMenuOpenId === businessId ? null : businessId;
  }



  onDeleteBusiness(id: number): void {
    if (confirm('Are you sure you want to delete this Business?')) {
      this.isDeleting = true;
      this.service.deleteBusiness(id).subscribe(
        (response) => {
          console.log('Business deleted successfully:', response);
          this.showBusiness.filter((business) => business.id !== id);
          this.isDeleting = false;
          this.message = 'Business deleted successfully';
          this.messageType = 'success';
          this.fetchBusiness();
        },
        (error) => {
          console.error('Error while deleting:', error);
          this.isDeleting = false;
          this.message = 'Error deleting business';
          this.messageType = 'error';
        }
      );
    }
  }

}
