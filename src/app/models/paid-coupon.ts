import { Coupon } from './Coupon';
import { Revenue } from './revenue';

export class PaidCoupon {
  id: number;
  couponId: number;
  revenueId: number;
  packageName: string;
  packageImage: string;

  constructor(
    id: number,
    couponId: number,
    revenueId: number,
    packageName: string,
    packageImage: string
  ) {
    this.id = id;
    this.couponId = couponId;
    this.revenueId = revenueId;
    this.packageName = packageName;
    this.packageImage = packageImage;
  }
}
