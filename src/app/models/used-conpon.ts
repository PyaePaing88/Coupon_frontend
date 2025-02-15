import { Coupon } from "./Coupon";

export interface UsedConpon {
    id: number;
    used_date: Date;
    coupon: Coupon;

}
