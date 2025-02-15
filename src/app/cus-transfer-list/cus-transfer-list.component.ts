import { Component } from '@angular/core';
import { Transfer } from '../models/transfer';
import { TransferService } from '../Services/transfer.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-cus-transfer-list',
  templateUrl: './cus-transfer-list.component.html',
  styleUrl: './cus-transfer-list.component.css',
})
export class CusTransferListComponent {
  isDropdownVisible: boolean = false;

  sender_id!: number;

  Dropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  transferList: Transfer[] = [];

  baseUrl = environment.apiUrl;

  constructor(
    private service: TransferService,
    private authservice: AuthService
  ) {
    const user = authservice.getLoggedUser();
    if (user) {
      this.sender_id = user.id;
    } else {
      console.error('User is null');
    }
  }

  ngOnInit(): void {
    if (this.authservice.getToken()) {
      this.getTransferList();
    }
  }

  getTransferList(): void {
    this.service.showTransferList(this.sender_id).subscribe(
      (data: Transfer[]) => {
        const currentDate = new Date();
        this.transferList = data.filter((transfer) => {
          return (
            transfer.expired_date &&
            new Date(transfer.expired_date) >= currentDate
          );
        });
      },
      (error) => {
        console.error('Error fetching transfer list', error);
        alert('An error occurred while fetching the transfer list.');
      }
    );
  }
}
