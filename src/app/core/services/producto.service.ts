import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Categoria } from '../models/categoria';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { ProductoPendiente } from '../models/producto-pendiente';
import { RechazoProducto } from '../models/rechazo-producto';
import { AceptProducto } from '../models/acept-producto';

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

  public getProductos(): Observable<Producto[]> {
    return this._http.get<Producto[]>(this.API_URL + 'get-productos');
  }

  public getProductosUsuario(idUser: number): Observable<Producto[]> {
    return this._http.get<Producto[]>(this.API_URL + 'productos-user/' + idUser);
  }

  public getImage(filename: string): Observable<Blob> {
    return this._http.get(this.API_URL + 'productos-img/' + filename, { responseType: 'blob' });
  }

  public getProdcutoId(id: number): Observable<Producto> {
    return this._http.get<Producto>(`${this.API_URL}get-procuto/${id}`);
  }

  public registrarCategoria(cate: Categoria): Observable<string> {
    return this._http.post<string>(`${this.API_URL}categoria-save`, cate);
  }

  public getProdcutosPendientes(): Observable<ProductoPendiente[]> {
    return this._http.get<ProductoPendiente[]>(`${this.API_URL}productos-pendientes`);
  }

  public rechazarProducto(rechazado: RechazoProducto): Observable<string> {
    return this._http.post<string>(`${this.API_URL}rechazo-producto`, rechazado)
  }

  public aceptarProducto(acept: AceptProducto): Observable<string> {
    return this._http.put<string>(`${this.API_URL}acept-producto`, acept)
  }

  public getCategoriasPendientes(): Observable<Categoria[]> {
    return this._http.get<Categoria[]>(`${this.API_URL}categories-pendientes`)
  }

  public updateCategoria(cate:Categoria):Observable<string>{
    return this._http.put<string>(`${this.API_URL}update-categoria/${cate.categoria_id}`,cate)
  }



}
