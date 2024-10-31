import { productDto } from "../../../admin/product/models/product.dto";
import { PaymentMethod } from "../../../core/models/enums/pay-method";
import { Usuario } from "../../../core/models/usuario";

export interface Cart {
    id:number
    total: number;
    payment_method: PaymentMethod;
    status: string;
    description_error: string;
    cartItems: CartItem[]
    created_at:string
    user:Usuario

}

export interface CartResponse {
    cart: Cart | null;
    pdfData?: Blob;
  }
  

export interface CartItem {
    quantity: number;
    sub_total: number;
    product: productDto;
}

export interface CartItemRport {
    quantity: number;
    total: number;
    product: productDto;
}