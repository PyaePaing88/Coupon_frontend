import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Packages } from '../models/package-model';
import { PackageService } from '../Services/package.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-adm-package',
  templateUrl: './adm-package.component.html',
  styleUrls: ['./adm-package.component.css'], // Corrected typo here
})
export class AdmPackageComponent implements OnInit {
  isSidebarCollapsed = false;
  title: any;
  isDeleting: boolean = false;
  message: string = '';
  messageType: string = '';
  filteredPackages: Packages[] = [];
  searchText: string = '';
  minPrice: number | null = null; // Min price filter
  maxPrice: number | null = null;

  baseUrl = environment.apiUrl;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  expandedIndex: number | null = null;

  toggleDescription(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  packages: Packages[] = [];

  constructor(
    private service: PackageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchPackages();
  }
  filterPackages(): void {
    const search = this.searchText.toLowerCase();
    this.filteredPackages = this.packages.filter((pkg) => {
      const unitPrice = Number(pkg.unit_price);

      const businessNameMatch = pkg.businessName.toLowerCase().includes(search);

      const minPriceMatch = this.minPrice
        ? pkg.unit_price >= this.minPrice
        : true;
      const maxPriceMatch = this.maxPrice
        ? pkg.unit_price <= this.maxPrice
        : true;

      return businessNameMatch && minPriceMatch && maxPriceMatch;
    });
  }

  isExpired(expiredDate: string): boolean {
    const today = new Date();
    return new Date(expiredDate) < today;
  }

  fetchPackages(): void {
    this.service.getALL().subscribe(
      (data) => {
        this.packages = data;
        this.filteredPackages = [...this.packages];
      },
      (error) => {
        console.error('Error fetching packages:', error);
      }
    );
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this package?')) {
      this.isDeleting = true;
      this.service.softDeletePackage(id).subscribe(
        (response: string) => {
          console.log('Package deleted successfully:', response);
          this.packages = this.packages.filter((pkg) => pkg.id !== id);
          this.isDeleting = false;
          this.message = 'Package deleted successfully';
          this.messageType = 'success';
          this.fetchPackages();
        },
        (error) => {
          console.error('Error while deleting:', error);
          this.isDeleting = false;
          this.message = 'Error deleting package';
          this.messageType = 'error';
        }
      );
    }
  }
}
