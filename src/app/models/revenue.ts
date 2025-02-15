import { PaidCoupon } from './paid-coupon';

export class Revenue {
  id: number;
  payDate: Date;
  fromDate: Date;
  toDate: Date;
  totalAmount: number;
  payAmount: number;
  percentage: number;
  quantity: number;
  businessId: number;
  businessName: string;
  paidCoupons: PaidCoupon[];

  constructor(
    id: number,
    payDate: Date,
    fromDate: Date,
    toDate: Date,
    totalAmount: number,
    payAmount: number,
    percentage: number,
    quantity: number,
    businessId: number,
    businessName: string,
    paidCoupons: PaidCoupon[]
  ) {
    this.id = id;
    this.payDate = payDate;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.totalAmount = totalAmount;
    this.payAmount = payAmount;
    this.percentage = percentage;
    this.quantity = quantity;
    this.businessId = businessId;
    this.businessName = businessName;
    this.paidCoupons = paidCoupons;
  }
}
