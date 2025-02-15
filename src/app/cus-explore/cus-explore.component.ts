import { Component } from '@angular/core';
import { Business } from '../models/business'; // Adjust the path as needed
import { Service } from '../models/service';
import { Category } from '../models/category';
import { BusinessService } from '../Services/business.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cus-explore',
  templateUrl: './cus-explore.component.html',
  styleUrls: ['./cus-explore.component.css'],
})
export class CusExploreComponent {
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedService: string = '';
  business: Business[] = [];
  filteredBusiness: Business[] = [];
  categoryName: string = '';

  baseUrl = environment.apiUrl;

  showBusiness: Business[] = [];
  showService: Service[] = [];
  showCategory: Category[] = [];

  constructor(private service: BusinessService) {}

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

  ngOnInit(): void {
    this.fetchBusiness();
    this.fetchCategories();
    this.fetchServices();
  }

  onCardAction(card: Business) {
    alert(`Viewing details for ${card.name}`);
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
}
