import { PaymentMethod } from "../../core/models/enums/pay-method";

export interface RegisterDto {
    name: string;
    email: string;
    cui: string;
    password: string;
    payment_method: PaymentMethod;
}

