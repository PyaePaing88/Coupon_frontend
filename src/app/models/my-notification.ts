import { NotificationStatus } from "./notification-status";

export interface MyNotification {
    id:number;
    notiDate:Date;
    user:any;
    notificationStatus:NotificationStatus;
    title:string;
    content:any;
}
