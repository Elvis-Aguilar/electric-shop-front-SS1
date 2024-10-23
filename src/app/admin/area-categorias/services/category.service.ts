import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiConfigService } from '../../../config/api-config.service';
import { categoriaDto } from '../models/category.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  private readonly _http = inject(HttpClient)

  private readonly apiConing = inject(ApiConfigService)

  constructor() { }


  public getAll(): Observable<categoriaDto[]> {
    return this._http.get<categoriaDto[]>(`${this.apiConing.API_CATEGORY}`);
  }


}
