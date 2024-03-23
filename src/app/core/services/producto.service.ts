import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Categoria } from '../models/categoria';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly _http = inject(HttpClient)
  private readonly API_URL = 'http://localhost/api-ecommerce/public/api/productos/';

  constructor() { }

  public getCategories(): Observable<Categoria[]> {
    return this._http.get<Categoria[]>(this.API_URL + 'categories');
  }

  public saveProducto(prod: Producto): Observable<Producto[]> {
    return this._http.post<Producto[]>(this.API_URL + 'producto-save', prod);
  }

  public saveImgProducto(formData: FormData): Observable<Producto> {
    return this._http.post<Producto>(this.API_URL + 'producto-save-image', formData);
  }

  public getProductos():Observable<Producto[]> {
    return this._http.get<Producto[]>(this.API_URL + 'get-productos');
  }

  public getProductosUsuario(idUser: number): Observable<Producto[]> {
    return this._http.get<Producto[]>(this.API_URL + 'productos-user/' + idUser);
  }

  public getImage(filename: string): Observable<Blob> {
    return this._http.get(this.API_URL + 'productos-img/' + filename, { responseType: 'blob' });
  }

  public getProdcutoId(id:number):Observable<Producto>{
    return this._http.get<Producto>(`${this.API_URL}get-procuto/${id}`);
  }

}
