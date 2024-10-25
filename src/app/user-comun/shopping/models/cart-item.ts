import { productDto } from "../../../admin/product/models/product.dto";

export interface cartItem{
    quantity:number;
    subToto:number;
    product:productDto;
}