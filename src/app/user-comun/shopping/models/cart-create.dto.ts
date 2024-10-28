import { CartItemCreateDto } from "./cart-item-create.dto";

export interface CartCreateDto {
    total: number;
    payment_method: string;
    user_id:number;
    items:CartItemCreateDto [];
    jwt: string;
}