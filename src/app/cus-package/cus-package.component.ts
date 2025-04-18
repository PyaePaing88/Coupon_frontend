import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Packages } from '../models/package-model';
import { PackageService } from '../Services/package.service';
import { CartService } from '../Services/cart.service';
import { Cart } from '../models/cart';
import { PaymentDataShareService } from '../Services/payment-data-share.service';
import { AuthService } from '../core/auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cus-package',
  templateUrl: './cus-package.component.html',
  styleUrls: ['./cus-package.component.css'],
})
export class CusPackageComponent implements OnInit {
  packages: Packages[] = [];
  filteredPackages: Packages[] = [];
  searchText: string = '';
  minPrice: number | null = null; // Min price filter
  maxPrice: number | null = null;

  submittedPackage: Packages[] = [];

  selectedPackage: any = null;
  isPopupVisible: boolean = false;

  selectedCartPackage: any = null;
  isCartPopupVisible: boolean = false;

  user_id: number = 0;
  baseUrl = environment.apiUrl;

  constructor(
    private paymentDataShare: PaymentDataShareService,
    private service: PackageService,
    private cartService: CartService,
    private router: Router,
    private toast: ToastrService,
    private authService: AuthService,
   
  ) {}

  ngOnInit(): void {
    this.service.getALL().subscribe(
      (data) => {
        this.submittedPackage = data.filter(
          (pkg) => !this.isExpired(pkg.expired_date) 

        );
        this.filteredPackages = [...this.submittedPackage];

      },
      (error) => {
        console.log('error' + error);
      }
    );

  }

  isExpired(expiredDate: string): boolean {
    const currentDate = new Date();
    const expirationDate = new Date(expiredDate);
    return expirationDate < currentDate;
  }

  filterPackages(): void {
    const search = this.searchText.toLowerCase();
    this.filteredPackages = this.submittedPackage.filter((pkg) => {
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

  openBuyNowPopup(packages: any): void {
    this.selectedPackage = { ...packages, selectedQuantity: 1 };
    this.isPopupVisible = true;
  }

  closeBuyNowPopup(): void {
    this.isPopupVisible = false;
  }

  confirmPurchase(): void {
    alert(
      `You purchased ${this.selectedPackage.selectedQuantity} of ${this.selectedPackage.name}.`
    );
    this.closeBuyNowPopup();
  }

  openAddToCartPopup(packages: any): void {
    this.checkLogin();
    this.selectedCartPackage = { ...packages, selectedQuantity: 1 };
    this.isCartPopupVisible = true;
  }

  closeAddToCartPopup(): void {
    this.isCartPopupVisible = false;
  }

  increaseQuantity(packageObj: any): void {
    if (packageObj.selectedQuantity < packageObj.quantity) {
      packageObj.selectedQuantity++;
    }
  }

  decreaseQuantity(packageObj: any): void {
    if (packageObj.selectedQuantity > 1) {
      packageObj.selectedQuantity--;
    }
  }

  buynow(selectedPackage: any) {
    // Prepare the package details to be sent as query parameters
    const packageDetails = {
      id: selectedPackage.id,
      name: selectedPackage.name,
      unit_price: selectedPackage.unit_price,
      description: selectedPackage.description,
      expired_date: selectedPackage.expired_date,
      quantity: selectedPackage.quantity,
      selectedQuantity: selectedPackage.selectedQuantity || 1,
      image: selectedPackage.image,
    };

    // Convert the package details to a JSON string and encode it
    const packageDetailsString = encodeURIComponent(
      JSON.stringify(packageDetails)
    );

    // Navigate to the payment page with the package details as query parameters
    this.router.navigate(['/payment'], {
      queryParams: { package: packageDetailsString },
    });
  }

  //-----------------Add to Cart-----------------

  confirmAddToCart(): void {
    if (!this.selectedCartPackage) {
      this.toast.error('No package selected.', 'Error');
      return;
    }

    const user = this.authService.getLoggedUser();
    const user_id = user ? user.id : 0;
    const unit_quantity = this.selectedCartPackage?.selectedQuantity || 1;
    const unit_price =
      (this.selectedCartPackage?.unit_price || 0) * unit_quantity;

    const cart = new Cart(
      0,
      user_id,
      this.selectedCartPackage?.id,
      unit_quantity,
      unit_price
    );

    this.cartService.addToCart(cart).subscribe(
      (response) => {
        this.toast.success('Item added to cart successfully!', 'Success');
        this.closeAddToCartPopup();
      },
      (error) => {
        this.toast.error(
          'Failed to add item to cart. Please try again.',
          'Error'
        );
        console.log('Payload sent to the server:', cart);
      }
    );
  }

  private checkLogin(): void {
    const currentState = { url: this.router.url };
    this.authService.ifLoggdIn(currentState);
  }
}
