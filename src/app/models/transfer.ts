export class Transfer{
   
    id: number | null = null;
    sender_id: number | null = null;
    coupon_id: number | null = null;
    receiver_id: number | null = null;
    receiverEmail: string = '';
    receiverName: string = '';
    senderName: string = '';
    transfer_date: Date | null = null;
    packageName: string = '';
    image: string = '';
    expired_date: Date | null = null;
    used_date: Date | null = null;
    note: string = '';

    constructor(init?: Partial<Transfer>) {
      Object.assign(this, init);
    } 
}