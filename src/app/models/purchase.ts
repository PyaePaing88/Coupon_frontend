export class Purchase {
  public id: number;
  public total_amount: number;
  public total_quantity: number;
  public payment_type: string;
  public transaction_id: string;
  public user_id: number;
  public purchase_date: Date | null;
  public unitprice: number;
  public image: string;

  constructor();

  constructor(
    id: number,
    total_amount: number,
    total_quantity: number,
    payment_type: string,
    transaction_id: string,
    user_id: number,
    purchase_date: Date | null,
    unitprice: number,
    image: string
  );

  constructor(
    id?: number,
    total_amount?: number,
    total_quantity?: number,
    payment_type?: string,
    transaction_id?: string,
    user_id?: number,
    purchase_date?: Date | null,
    unitprice?: number,
    image?: string
  ) {
    this.id = id || 0;
    this.total_amount = total_amount || 0;
    this.total_quantity = total_quantity || 0;
    this.payment_type = payment_type || '';
    this.transaction_id = transaction_id || '';
    this.user_id = user_id || 0;
    this.purchase_date = purchase_date || null;
    this.unitprice = unitprice || 0;
    this.image = image || '';
  }
}
