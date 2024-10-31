import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ApiConfigService } from "../../../config/api-config.service";
import { productDto } from "../../../admin/product/models/product.dto";
import { cartItem } from "../models/cart-item";
import { CartCreateDto } from "../models/cart-create.dto";
import { Cart } from "../models/cart-reques";
import { user, userResponse } from "../models/user-validation";
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';


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


    registerCart(cart: CartCreateDto): Observable<Blob | null> {
        return this._http.post(`${this.apiConfig.API_CART}`, cart, {
            responseType: 'blob' // Maneja el PDF como Blob
        }).pipe(
            map((response) => {
                const blob = new Blob([response], { type: 'application/pdf' });
                // Verifica si el Blob tiene contenido (tamaño mayor que 0)
                return blob.size > 0 ? blob : null;
            }),
            catchError((error) => {
                console.error('Error al descargar el PDF:', error);
                return of(null); // Retorna null si hay un error
            })
        );
    }
    
    public getCartById(): Observable<Cart> {
        return this._http.get<Cart>(`${this.apiConfig.API_CART}/${this.idResumen}`);
    }

    public getAllCartUserById(userId: number): Observable<Cart[]> {
        return this._http.get<Cart[]>(`${this.apiConfig.API_CART}/users/${userId}`);
    }

    public getAllCart(): Observable<Cart[]> {
        return this._http.get<Cart[]>(`${this.apiConfig.API_CART}`);
    }

    public loginValidUserAOrB(user: user, pay: string) {
        return this._http.post<userResponse>(`${this.apiConfig.API_CART}/${pay}`, user)
    }

    public findLastCartByUserid(id:number): Observable<Cart> {
        return this._http.get<Cart>(`${this.apiConfig.API_CART}/last/${id}`);
    }

}