export class Feedback {
  id: number;
  message: string;
  feedback_date: Date;
  userId: number;
  user_name: string;
  user_email: string;
  user_photo: string | null;

  constructor(
    id: number = 0,
    message: string = '',
    feedback_date: Date = new Date(),
    userId: number = 0,
    user_name: string = '',
    user_email: string = '',
    user_photo: string | null = null
  ) {
    this.id = id;
    this.message = message;
    this.feedback_date = feedback_date;
    this.userId = userId;
    this.user_name = user_name;
    this.user_email = user_email;
    this.user_photo = user_photo;
  }
}

