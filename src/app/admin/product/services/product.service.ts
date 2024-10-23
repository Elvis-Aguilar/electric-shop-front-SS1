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

  getAllProduct(): Observable<productDto[]> {
    return this._http.get<productDto[]>(`${this.apiConfig.API_PRODUCT}`)
  }



}
