import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ApiConfigService } from "../../../config/api-config.service";
import { productDto } from "../../../admin/product/models/product.dto";
import { cartItem } from "../models/cart-item";
import { Observable } from "rxjs";
import { CartCreateDto } from "../models/cart-create.dto";
import { Cart } from "../models/cart-reques";
import { user, userResponse } from "../models/user-validation";

@Injectable({
    providedIn: 'root'
})
export class ShoppingServie {

    private readonly _http = inject(HttpClient);
    private readonly apiConfig = inject(ApiConfigService)


    itemsCart: cartItem[] = []
    products: productDto[] = []
    direccion: string = ''
    cantidad: number = 0
    total: string = ''
    idResumen = 1


    constructor() { }

    public registerCart(us: CartCreateDto): Observable<Cart> {
        return this._http.post<Cart>(`${this.apiConfig.API_CART}`, us);
    }

    public getCartById(): Observable<Cart> {
        return this._http.get<Cart>(`${this.apiConfig.API_CART}/${this.idResumen}`);
    }

    public getAllCartUserById(userId:number): Observable<Cart[]> {
        return this._http.get<Cart[]>(`${this.apiConfig.API_CART}/users/${userId}`);
    }

    public getAllCart(): Observable<Cart[]> {
        return this._http.get<Cart[]>(`${this.apiConfig.API_CART}`);
    }

    public loginValidUserAOrB(user: user, pay: string) {
        return this._http.post<userResponse>(`${this.apiConfig.API_CART}/${pay}`, user)
    }
}