import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CouponService } from '../Services/coupon.service';

interface MenuItem {
  icon: string;
  label: string;
  route?: string; // Optional route for navigation
  children?: MenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-adm-sidebar',
  templateUrl: './adm-sidebar.component.html',
  styleUrl: './adm-sidebar.component.css',
})
export class AdmSidebarComponent {
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(item: MenuItem) {
    // Only toggle if sidebar is not collapsed and item has children
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }

  pendingCouponCount: number = 0;

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.couponService.getPendingCouponCount().subscribe({
      next: (count) => {
        this.pendingCouponCount = count;
        console.log('Pending coupon count:', count);
      },
      error: (err) => {
        console.error('Error fetching pending coupon count', err);
      },
    });
  }
}
