import { Business } from "./business";

export class Packages {
  public id: number;
  public name: string;
  public unit_price: number;
  public quantity: number;
  public create_date: Date;
  public image?: string; // Optional property
  public description?: string; // Optional property
  public business_id: number; // Optional property
  public businessName:string;
  public expired_date: string; // New optional property
  public selectedQuantity: number;
  public business?: Business;

  constructor(
    id: number = 0,
    name: string = '',
    unit_price: number = 0,
    quantity: number = 0,
    create_date: Date = new Date(),
    image?: string,
    description?: string,
    business_id?: number,
    businessName?:string,
    expired_date?: string,
    selectedQuantity?: number,
    business?: Business
  ) {
    this.id = id;
    this.name = name;
    this.unit_price = unit_price;
    this.quantity = quantity;
    this.create_date = create_date;
    this.image = image;
    this.description = description;
    this.business_id = business_id || 0;
    this.businessName=businessName || '';
    this.expired_date = expired_date || ''; // Initialize expiration date
    this.selectedQuantity = selectedQuantity || 0;
    this.expired_date = expired_date || ''; // Initialize expiration date
    this.business = business; // Initialize business object
  }
}
