import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Servicio } from '../../models/servicios/servicio';
import { Observable } from 'rxjs';
import { Oferta } from '../../models/servicios/oferta';

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

  public getImage(filename: string): Observable<Blob> {
    return this._http.get(`${this.API_URL}servicios-img/${filename}`, { responseType: 'blob' });
  }

  public getServicosUsuario(idUser: number): Observable<Servicio[]> {
    return this._http.get<Servicio[]>(`${this.API_URL}servicios-user/${idUser}`);
  }

  public getServiciosTodos(): Observable<Servicio[]> {
    return this._http.get<Servicio[]>(`${this.API_URL}get-servicios`);
  }

  public getServicioId(id: number): Observable<Servicio> {
    return this._http.get<Servicio>(`${this.API_URL}get-servicio/${id}`);
  }

  public saveOferta(ofer: Oferta): Observable<string> {
    return this._http.post<string>(this.API_URL + 'save-oferta', ofer);
  }
  

}
