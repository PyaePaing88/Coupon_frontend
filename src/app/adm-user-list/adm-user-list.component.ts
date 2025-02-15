import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-adm-user-list',
  templateUrl: './adm-user-list.component.html',
  styleUrls: ['./adm-user-list.component.css'],
})
export class AdmUserListComponent {
  isSidebarCollapsed = false;
  users: User[] = [];
  filteredUsers: User[] = []; // Holds filtered users
  searchQuery: string = ''; // Search query for name or email
  selectedRole: string = ''; // Selected role for filtering
  baseUrl = environment.apiUrl;

  isDeleting: boolean = false;
  message: string = '';
  messageType: string = '';

  constructor(private router: Router, private userServices: UserService) {}

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  fetchUsers(): void {
    this.userServices.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.filteredUsers = [...this.users]; // Initialize filteredUsers with all users
      },
      (error) => {
        console.log('Error fetching users: ', error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  // Method to handle search query change
  onSearchChange(searchQuery: string) {
    this.searchQuery = searchQuery.toLowerCase(); // Convert search query to lowercase
    this.filterUsers(); // Filter users based on updated search query and selected role
  }

  onRoleChange(event: any) {
    const selectedRole = event.target.value;
    this.selectedRole = selectedRole; // Store the selected role
    this.filterUsers(); // Filter users based on the updated selected role and search query
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter((user) => {
      const matchesSearchQuery =
        (user.name?.toLowerCase().includes(this.searchQuery) ||
          user.email?.toLowerCase().includes(this.searchQuery)) ??
        false;

      const matchesRole =
        !this.selectedRole ||
        (user.role &&
          user.role.toLowerCase().includes(this.selectedRole.toLowerCase()));

      return matchesSearchQuery && matchesRole;
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this User?')) {
      this.isDeleting = true;
      this.userServices.deleteUserById(id).subscribe(
        (response) => {
          console.log('User deleted successfully:', response);
          this.users.filter((user) => user.id !== id);
          this.isDeleting = false;
          this.message = 'User deleted successfully';
          this.messageType = 'success';
          this.fetchUsers();
        },
        (error) => {
          console.error('Error while deleting:', error);
          this.isDeleting = false;
          this.message = 'Error deleting user';
          this.messageType = 'error';
        }
      );
    }
  }
}
