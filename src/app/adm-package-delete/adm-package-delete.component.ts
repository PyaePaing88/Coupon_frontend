import { Component } from '@angular/core';
import { Packages } from '../models/package-model';
import { PackageService } from '../Services/package.service';
import { nextTick } from 'process';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-adm-package-delete',
  templateUrl: './adm-package-delete.component.html',
  styleUrl: './adm-package-delete.component.css',
})
export class AdmPackageDeleteComponent {
  deletedPackages: Packages[] = [];
  baseUrl = environment.apiUrl;

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    this.loadDeletedPackages();
  }

  loadDeletedPackages(): void {
    this.packageService.getDeletedPackages().subscribe(
      (data) => {
        this.deletedPackages = data;
      },
      (error) => {
        console.error('Error fetching deleted packages', error);
      }
    );
  }

  // restorePackage(packageId: number): void{
  //   this.packageService.restorePackage(packageId).subscribe({
  //     next: () => {
  //       this.loadDeletedPackages();
  //       console.log(`Package with ID ${packageId} restored successfully.`);
  //     },
  //     error: (err) => {
  //       console.error(`Error restoring package with ID ${packageId}`, error);
  //     }
  //   });
  // }

  // Method to restore a business by ID
  restorePackage(packageId: number): void {
    this.packageService.restorePackage(packageId).subscribe({
      next: () => {
        this.loadDeletedPackages();
        console.log('Package restored successfully');
      },
      error: (err) => {
        console.error('Error restoring package:', err);
      },
    });
  }
}
