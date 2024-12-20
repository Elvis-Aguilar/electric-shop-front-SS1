import { Injectable, inject } from '@angular/core';
import { ApiConfigService } from '../../../config/api-config.service';
import { supplier, supplierCreate } from '../models/supplir.dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private readonly apiConfigService = inject(ApiConfigService)
  private readonly _http = inject(HttpClient)


  constructor() { }

  createSuppliers(suple:supplierCreate): Observable<supplier> {
    return this._http.post<supplier>(`${this.apiConfigService.API_SUPPLIER}`,suple);
  }

  getAllSupplier(): Observable<supplier[]> {
    return this._http.get<supplier[]>(`${this.apiConfigService.API_SUPPLIER}`);
  }
}
