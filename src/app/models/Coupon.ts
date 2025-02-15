export class Coupon {
  id: number = 0; // Coupon ID
  expired_date: Date | null = null; // Expiration date of the coupon
  confirm: string | null = null; // Confirmation status
  used_status: boolean | null = null; // Coupon usage status
  transfer_status: boolean | null = null; // Transfer status
  paid_status: boolean | null = null; // Transfer status
  purchase_id: number | null = null; // Associated purchase ID
  package_id: number | null = null; // Associated package ID
  businessId: number | null = null;
  businessName: string = '';
  packageName: string = '';
  purchase_date: Date | null = null;
  unit_price: number | null = null;
  image: string = '';
  description: string = '';
  owner: string = '';
  used_date: Date | null = null;

  constructor(init?: Partial<Coupon>) {
    Object.assign(this, init);
  }
}
