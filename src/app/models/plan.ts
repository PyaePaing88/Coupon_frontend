export class Plan {
  id: number;
  name: string;
  max_packages: number;
  price: number;

  constructor(
    id: number = 0,
    name: string = '',
    max_packages: number = 0,
    price: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.max_packages = max_packages;
    this.price = price;
  }
}
