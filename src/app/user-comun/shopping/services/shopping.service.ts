import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ApiConfigService } from "../../../config/api-config.service";
import { productDto } from "../../../admin/product/models/product.dto";
import { cartItem } from "../models/cart-item";

@Injectable({
    providedIn: 'root'
})
export class ShoppingServie {

    private readonly http = inject(HttpClient);
    private readonly apiConfig = inject(ApiConfigService)


    itemsCart: cartItem [] = []
    products: productDto[] = []
    direccion: string = ''
    cantidad: number = 0
    total: string = ''


    constructor() { }
}