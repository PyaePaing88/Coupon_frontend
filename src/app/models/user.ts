export class User {
  id?: number | null;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: string;
  register_date: string;
  photo?: string;

  constructor();

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    role: string,
    register_date: string,
    photo: string
  );

  constructor(
    id?: number,
    name?: string,
    email?: string,
    password?: string,
    phone?: string,
    role?: string,
    register_date?: string,
    photo?: string
  ) {
    this.id = id || 0;
    this.name = name || '';
    this.email = email || '';
    this.password = password || '';
    this.phone = phone || '';
    this.role = role || '';
    this.register_date = register_date || '';
    this.photo = photo || '';
  }
}
