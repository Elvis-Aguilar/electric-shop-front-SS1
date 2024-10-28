import { Injectable, inject } from '@angular/core';
import { ApiConfigService } from '../../../config/api-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { productDto } from '../models/product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiConfig = inject(ApiConfigService);
  private readonly _http = inject(HttpClient)


  constructor() { }

  createProduct(product: productDto): Observable<productDto> {
    return this._http.post<productDto>(`${this.apiConfig.API_PRODUCT}`, product)
  }

  updateProdcut(id:number, product: productDto): Observable<productDto> {
    return this._http.put<productDto>(`${this.apiConfig.API_PRODUCT}/${id}`, product)
  }

  getAllProduct(): Observable<productDto[]> {
    return this._http.get<productDto[]>(`${this.apiConfig.API_PRODUCT}`)
  }

  getById(id: number): Observable<productDto> {
    return this._http.get<productDto>(`${this.apiConfig.API_PRODUCT}/${id}`)
  }

  getByIdCtaegory(id: number): Observable<productDto[]> {
    return this._http.get<productDto[]>(`${this.apiConfig.API_PRODUCT}/category/${id}`)
  }

  getByIdSupplier(id: number): Observable<productDto[]> {
    return this._http.get<productDto[]>(`${this.apiConfig.API_PRODUCT}/supplier/${id}`)
  }

  deletedProduct(id: number): Observable<productDto> {
    return this._http.delete<productDto>(`${this.apiConfig.API_PRODUCT}/${id}`)
  }



}
