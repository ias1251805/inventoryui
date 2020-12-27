


export class ItemDetails {
    id?: string;
    quantity?: string;
    expirationDate?: string;
    item_id: string;
    user_id: string;

    constructor(quantity:string, expirationDate: string,item_id: string, user_id: string){
        this.quantity = quantity;
        this.expirationDate = expirationDate;
        this.item_id = item_id;
        this.user_id = user_id;
    }
    
}