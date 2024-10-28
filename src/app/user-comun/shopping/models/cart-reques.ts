import { productDto } from "../../../admin/product/models/product.dto";
import { PaymentMethod } from "../../../core/models/enums/pay-method";

export interface Cart {
    id:number
    total: number;
    payment_method: PaymentMethod;
    status: string;
    description_error: string;
    cartItems: CartItem[]
    created_at:string

}

export interface CartItem {
    quantity: number;
    sub_total: number;
    product: productDto;
}