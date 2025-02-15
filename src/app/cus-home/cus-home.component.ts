import { Component } from '@angular/core';
import { Business } from '../models/business';
import { BusinessService } from '../Services/business.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cus-home',
  templateUrl: './cus-home.component.html',
  styleUrls: ['./cus-home.component.css'],
})
export class CusHomeComponent {
  searchQuery: string = '';

  categories: string[] = ['All', 'Hotel', 'Bar', 'Health', 'Restaurant', 'Gym']; // Include 'All' in categories
  selectedCategory: string = 'All'; // Default to 'All'
  filteredBusiness: Business[] = [];
  showBusiness: Business[] = [];
  baseUrl = environment.apiUrl;

  constructor(private service: BusinessService) {}

  fetchBusiness() {
    this.service.getBusiness().subscribe(
      (data) => {
        this.showBusiness = data; // Assign the fetched categories to the showCategory variable
        this.filteredBusiness = data;
        this.filterBusiness();
      },
      (error) => {
        console.log('Error fetching business: ', error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchBusiness();
  }

  // Handle the change in category selection
  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterBusiness();
  }

  filterBusiness(): void {
    if (this.selectedCategory === 'All') {
      this.filteredBusiness = [...this.showBusiness];
    } else {
      this.filteredBusiness = this.showBusiness.filter((business) =>
        business.categoryName.includes(this.selectedCategory)
      );
    }
  }
}
