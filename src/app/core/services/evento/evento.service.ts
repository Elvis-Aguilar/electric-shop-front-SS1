import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoEvento } from '../../models/evento/tipo-evento';
import { Producto } from '../../models/producto/producto';
import { Evento } from '../../models/evento/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private readonly _http = inject(HttpClient);
  private readonly API_URL = 'http://localhost/api-ecommerce/public/api/eventos/';

  constructor() { }

  public getTipoEvento(): Observable<TipoEvento[]> {
    return this._http.get<TipoEvento[]>(`${this.API_URL}tipo-eventos`);
  }

  public saveImgEvento(formData: FormData): Observable<Producto> {
    return this._http.post<Producto>(`${this.API_URL}evento-save-image`, formData);
  }

  public saveEvento(eve: Evento): Observable<string> {
    return this._http.post<string>(`${this.API_URL}evento-save`, eve);
  }

  public getEventosUsuario(idUser: number): Observable<Evento[]> {
    return this._http.get<Evento[]>(`${this.API_URL}eventos-user/${idUser}`);
  }

  public getImage(filename: string): Observable<Blob> {
    return this._http.get(`${this.API_URL}eventos-img/${filename}`, { responseType: 'blob' });
  }



}
