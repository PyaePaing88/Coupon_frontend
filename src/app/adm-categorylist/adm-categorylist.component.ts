import { Component, HostListener } from '@angular/core';
import { Category } from '../models/category';
import { Service } from '../models/service';
import { BusinessService } from '../Services/business.service';

@Component({
  selector: 'app-adm-categorylist',
  templateUrl: './adm-categorylist.component.html',
  styleUrl: './adm-categorylist.component.css',
})
export class AdmCategorylistComponent {
  categories: Category[] = [];
  newCategory: Category = new Category(0, '',false); // Initial empty category for adding
  selectedCategory: Category | null = null; // For editing

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

  showCategory: Category[] = [];

  categoryToDelete: any = null;

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

 

  openEditCategoryModal(category: Category): void {
    this.selectedCategory = { ...category }; // Clone category for editing
  }

  // Close Modal
  closeEditCategoryModal(): void {
    this.selectedCategory = null; // Clear selected category
  }

  updateCategory(): void {
    if (this.selectedCategory) {
      this.service.updateCategory(this.selectedCategory.id, this.selectedCategory).subscribe(
        (updatedCategory) => {
          const index = this.categories.findIndex((cat) => cat.id === updatedCategory.id);
          this.fetchCategories();

          if (index !== -1) {
            this.categories[index] = updatedCategory;
          }
          this.selectedCategory = null; // Clear selected category after saving
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  }

  confirmDeleteCategory(category: any) {
    this.categoryToDelete = category; // Set the category to delete
  }

  deleteCategory(id: number) {
    this.service.deleteCategory(id).subscribe(
      () => {
        console.log('Category deleted successfully');
        // Fetch the updated category list
        this.fetchCategories();
        this.categoryToDelete = null; // Reset the modal
      },
      (error) => {
        console.error('Error deleting category:', error);
        alert('Failed to delete the category. Please try again.');
        this.categoryToDelete = null; // Reset the modal
      }
    );
  }
  
  

  cancelDelete() {
    this.categoryToDelete = null; // Close the delete modal without deleting
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
