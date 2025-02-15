import { Component } from '@angular/core';
import { PaymentMethod } from '../models/payment-method';
import { Router } from '@angular/router';
import { PaymentMethodService } from '../Services/payment-method.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.css',
})
export class PaymentMethodComponent {
  paymentMethods: PaymentMethod[] = [];
  isSidebarCollapsed = false;
  title: any;
  paymentMethodDTO: PaymentMethod = new PaymentMethod();
  selectedFile: File | null = null;

  isEditing = false; // Indicates whether the edit form is active
  selectedPaymentMethod: PaymentMethod | null = null;
  editSelectedFile: File | null = null;

  bsseUrl = environment.apiUrl;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  isModalOpen = false;
  imagePreview: string | null = null;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.selectedFile = file; // Update selectedFile
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null; // Clear selectedFile if no file is selected
      this.imagePreview = null; // Clear preview if no file is selected
    }
  }

  constructor(
    private paymentmethodService: PaymentMethodService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchPaymentMethods();
  }

  fetchPaymentMethods(): void {
    this.paymentmethodService.getPaymentMethods().subscribe(
      (data) => {
        this.paymentMethods = data;
      },
      (error) => {
        console.error('Error fetching payment methods:', error);
      }
    );
  }

  submitPaymentMethod(): void {
    // Check for missing fields before submission
    if (!this.paymentMethodDTO.paymentType || !this.selectedFile) {
      this.toast.warning('Please provide all required fields.', 'Warning'); // Show warning toast for missing fields
      console.log('Selected file:', this.selectedFile); // Log selected file state
      return; // Prevent submission if fields are missing
    }

    // Proceed with form submission if all required fields are provided
    const formData = new FormData();
    formData.append(
      'paymentMethodDTO',
      new Blob([JSON.stringify(this.paymentMethodDTO)], {
        type: 'application/json',
      })
    );
    formData.append('image', this.selectedFile); // Append the selected file

    this.paymentmethodService.createPaymentMethod(formData).subscribe(
      (response) => {
        this.toast.success('Payment method created successfully!', 'Success'); // Success toast on successful submission
        console.log('Payment method created successfully:', response);
        // this.router.navigate(['/payment-methods']); // Navigate to list or other actions after success
        this.closeModal();
        this.fetchPaymentMethods(); // Refresh the list after creating a new payment method
      },
      (error) => {
        this.toast.error(
          'Failed to create payment method. Please try again.',
          'Error' // Error toast in case of failure
        );
        console.error('Error creating payment method:', error);
      }
    );
  }

  onEditFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.editSelectedFile = file;

      // Display image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.selectedPaymentMethod) {
          this.selectedPaymentMethod.image = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  editPaymentMethod(id: number): void {
    const method = this.paymentMethods.find((m) => m.id === id);
    if (method) {
      this.isEditing = true;
      // Clone the method to avoid directly modifying the original object in the array
      this.selectedPaymentMethod = { ...method };
    } else {
      console.error('Payment method not found for editing.');
      alert('Error: Payment method not found!');
    }
  }

  updatePaymentMethod(): void {
    if (!this.selectedPaymentMethod) {
      alert('No payment method selected for editing.');
      return;
    }

    const formData = new FormData();
    formData.append(
      'paymentMethodDTO',
      new Blob([JSON.stringify(this.selectedPaymentMethod)], {
        type: 'application/json',
      })
    );

    if (this.editSelectedFile) {
      formData.append('image', this.editSelectedFile);
    }

    this.paymentmethodService
      .updatePaymentMethod(this.selectedPaymentMethod.id!, formData)
      .subscribe(
        (response) => {
          console.log('Payment method updated successfully:', response);
          alert('Payment method updated successfully!');
          this.isEditing = false;
          this.selectedPaymentMethod = null;
          this.fetchPaymentMethods(); // Refresh the list after updating
        },
        (error) => {
          console.error('Error updating payment method:', error);
          alert('Failed to update payment method.');
        }
      );
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedPaymentMethod = null;
    this.editSelectedFile = null;
  }

  deletePaymentMethod(id: number): void {
    if (confirm('Are you sure you want to delete this payment method?')) {
      this.paymentmethodService.deletePaymentMethod(id).subscribe(
        () => {
          this.paymentMethods = this.paymentMethods.filter(
            (method) => method.id !== id
          );
        },
        (error) => {
          console.error('Error deleting payment method:', error);
        }
      );
    }
  }
}
