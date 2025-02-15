export class PaymentMethod {
  public id: number;
  public paymentType: string;
  public image: string;

  constructor();

  constructor(id: number, paymentType: string, image: string);

  constructor(id?: number, paymentType?: string, image?: string) {
    this.id = id || 0;
    this.paymentType = paymentType || '';
    this.image = image || '';
  }
}
