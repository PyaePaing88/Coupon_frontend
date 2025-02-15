import { Component } from '@angular/core';
import { Business } from '../models/business';
import { BusinessService } from '../Services/business.service';

@Component({
  selector: 'app-adm-delete-list',
  templateUrl: './adm-delete-list.component.html',
  styleUrl: './adm-delete-list.component.css',
})
export class AdmDeleteListComponent {
  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  activeTab: string = 'business'; // Default tab

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
