import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Divisa } from '../../models/divisa/divisa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DivisaService {

  private readonly _http = inject(HttpClient)

  private readonly API_URL = 'http://localhost/api-ecommerce/public/api/divisa/';

  constructor() { }

  public getDivisa(): Observable<Divisa> {
    return this._http.get<Divisa>(`${this.API_URL}get-divisa`);
  }

  public updateDivis(div:Divisa): Observable<Divisa> {
    return this._http.put<Divisa>(`${this.API_URL}update-divisa/${div.divisa_id}`,div);
  }
}
