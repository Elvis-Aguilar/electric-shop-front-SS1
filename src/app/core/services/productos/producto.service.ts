import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Categoria } from '../../models/producto/categoria';
import { Observable } from 'rxjs';
import { Producto } from '../../models/producto/producto';
import { ProductoPendiente } from '../../models/producto/producto-pendiente';
import { RechazoProducto } from '../../models/producto/rechazo-producto';
import { AceptProducto } from '../../models/producto/acept-producto';
import { Reporte } from '../../models/reporte';
import { CompraProducto } from '../../models/producto/compra-producto';

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

  public updateCategoria(cate: Categoria): Observable<string> {
    return this._http.put<string>(`${this.API_URL}update-categoria/${cate.categoria_id}`, cate)
  }

  public getCategoriaProducto(id: number): Observable<Categoria[]> {
    return this._http.get<Categoria[]>(`${this.API_URL}categoria-producto/${id}`)
  }

  public deletCategoriaProdcuto(id: number): Observable<Categoria[]> {
    return this._http.delete<Categoria[]>(`${this.API_URL}delete-categoria-producto/${id}`)
  }

  public asociarCategoriaProducto(cate: Categoria): Observable<Categoria[]> {
    return this._http.post<Categoria[]>(`${this.API_URL}asociar-categoria-producto/${cate.estado}`, cate)
  }

  public updateProducto(prod: Producto, id: number): Observable<string> {
    return this._http.put<string>(`${this.API_URL}update-producto/${id}`, prod)
  }

  public getMotivoRechazo(id: number): Observable<RechazoProducto> {
    return this._http.get<RechazoProducto>(`${this.API_URL}get-rechazo/${id}`)
  }

  public getProdcutosFilterCategorias(idCategoria: number): Observable<Producto[]> {
    return this._http.get<Producto[]>(`${this.API_URL}get-productos-filter-categoria/${idCategoria}`);
  }

  public getProductosFilterFormPago(op: number): Observable<Producto[]> {
    return this._http.get<Producto[]>(`${this.API_URL}get-productos-filter-form-pago/${op}`);
  }

  public saveRerporte(rep:Reporte): Observable<string>{
    return this._http.post<string>(`${this.API_URL}save-report-producto`,rep)
  }

  public getReportesProducto(): Observable<Reporte[]> {
    return this._http.get<Reporte[]>(`${this.API_URL}get-reportes-productos`);
  }

  public updateReporteVisto(prod: Reporte, id: number): Observable<string> {
    return this._http.put<string>(`${this.API_URL}update-reporte-producto/${id}`, prod)
  }

  public getReportesProductoEspecifico(id:number): Observable<Reporte[]> {
    return this._http.get<Reporte[]>(`${this.API_URL}get-reportes-producto/${id}`);
  }

  public darDeBaja(prod: Reporte, id: number): Observable<string> {
    return this._http.put<string>(`${this.API_URL}baja-producto/${id}`, prod)
  }
  
  public comprarProducto(compra:CompraProducto): Observable<string>{
    return this._http.post<string>(`${this.API_URL}save-compra-producto`,compra)
  }

}
