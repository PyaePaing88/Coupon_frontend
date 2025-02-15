export class Review {
  id: number;
  businessId: number;
  userId: number;
  rating: number;
  message: string;
  review_date: Date;
  user_name: string;
  user_photo: string;
  action: string | null = null;

  constructor(
    id: number = 0,
    businessId: number = 0,
    userId: number = 0,
    rating: number = 0,
    message: string = '',
    review_date: Date = new Date(),
    user_name: string = '',
    user_photo: string = '',
   action: string | null = null

  ) {
    this.id = id;
    this.businessId = businessId;
    this.userId = userId;
    this.rating = rating;
    this.message = message;
    this.review_date = review_date;
    this.user_name = user_name;
    this.user_photo = user_photo;
    this.action = action;
  }
}
