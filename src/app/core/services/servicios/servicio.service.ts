import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Servicio } from '../../models/servicios/servicio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private readonly _http = inject(HttpClient)
  private readonly API_URL = 'http://localhost/api-ecommerce/public/api/servicios/';

  constructor() { }


  public saveServicio(servi: Servicio): Observable<string> {
    return this._http.post<string>(this.API_URL + 'servicio-save', servi);
  }

  public saveImgServicio(formData: FormData): Observable<Servicio> {
    return this._http.post<Servicio>(this.API_URL + 'servicio-save-image', formData);
  }
}
