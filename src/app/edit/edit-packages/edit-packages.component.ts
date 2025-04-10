import { Component } from '@angular/core';
import { PackageService } from '../../Services/package.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Packages } from '../../models/package-model';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-packages',
  templateUrl: './edit-packages.component.html',
  styleUrl: './edit-packages.component.css',
})
export class EditPackagesComponent {
  title: any;
  package: Packages = new Packages();
  id: number = 0;

  selectedFile: File | null = null;
  oldImageUrl: string = '';
  imagePreview: string | ArrayBuffer | null = '';

  baseUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private service: PackageService,
    private router: Router,
    private location: Location
  ) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.id);

    if (this.id !== null) {
      this.service.findByid(this.id).subscribe(
        (data) => {
          this.package = data;
          console.log('Fetched package data: ', this.package);
          if (this.package.image) {
            this.oldImageUrl = 'http://localhost:8080' + this.package.image;
          }
        },
        (error) => {
          console.log('Error fetching data: ', error);
        }
      );
    }
  }

  onSubmit(myForm: NgForm) {
    const formData = new FormData();

    const selectedFile = this.selectedFile;

    this.service.updateByid(this.package, selectedFile).subscribe(
      (response) => {
        this.router.navigate(['/business-home']);
      },
      (error) => {
        console.log('Error editing :' + error);
      }
    );
  }

  onCancel(): void {
    this.location.back(); // Go back to the previous page, i.e., business list
  }
}
