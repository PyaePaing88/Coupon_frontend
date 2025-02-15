export class BusinessPlan {
  id?: number; // Optional because it will be generated in the backend
  total_amount: number;
  paymentType: string;
  transaction_id: string;
  payment_date: string; // ISO string format for compatibility
  businessId: number;
  planId: number;
  max_package?: number;

  constructor(
    total_amount: number,
    paymentType: string,
    transaction_id: string,
    payment_date: string,
    businessId: number,
    planId: number,
    max_package: number
  ) {
    this.total_amount = total_amount;
    this.paymentType = paymentType;
    this.transaction_id = transaction_id;
    this.payment_date = payment_date;
    this.businessId = businessId;
    this.planId = planId;
    this.max_package = max_package;
  }
}
