import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoEvento } from '../../models/evento/tipo-evento';
import { Producto } from '../../models/producto/producto';
import { Evento } from '../../models/evento/evento';
import { EventoPendiente } from '../../models/evento/evento-pendiente';
import { RechazoEvento } from '../../models/evento/rechazo-evento';
import { AceptEvento } from '../../models/evento/acept-evento';

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

  public getEventosPendientes(): Observable<EventoPendiente[]> {
    return this._http.get<EventoPendiente[]>(`${this.API_URL}eventos-pendientes`);
  }

  public rechazarEvento(rechazado: RechazoEvento): Observable<string> {
    return this._http.post<string>(`${this.API_URL}rechazo-evento`, rechazado)
  }

  public aceptarEvento(acept: AceptEvento): Observable<string> {
    return this._http.put<string>(`${this.API_URL}acept-evento`, acept)
  }

  public getMotivoRechazo(id: number): Observable<RechazoEvento> {
    return this._http.get<RechazoEvento>(`${this.API_URL}get-rechazo/${id}`)
  }

  public registrarTipoEvento(cate: TipoEvento): Observable<string> {
    return this._http.post<string>(`${this.API_URL}tipo-evento-save`, cate);
  }

  public getTipoEventoPendientes(): Observable<TipoEvento[]> {
    return this._http.get<TipoEvento[]>(`${this.API_URL}tipo-evento-pendientes`)
  }

  public updateCategoria(tipoEvent: TipoEvento): Observable<string> {
    return this._http.put<string>(`${this.API_URL}update-tipo-evento/${tipoEvent.tipo_even_id}`, tipoEvent)
  }

  public getEventos(): Observable<Evento[]> {
    return this._http.get<Evento[]>(`${this.API_URL}get-eventos`);
  }

  public getEventoId(id: number): Observable<Evento> {
    return this._http.get<Evento>(`${this.API_URL}get-evento/${id}`);
  }

  public getEventoFilterCategorias(idTipo: number): Observable<Evento[]> {
    return this._http.get<Evento[]>(`${this.API_URL}get-eventos-filter-tipo/${idTipo}`);
  }

  public getEventoFilterFormPago(op: number): Observable<Evento[]> {
    return this._http.get<Evento[]>(`${this.API_URL}get-eventos-filter-form-pago/${op}`);
  }

  public getTipoEventoId(id: number): Observable<TipoEvento[]> {
    return this._http.get<TipoEvento[]>(`${this.API_URL}tipo-evento/${id}`)
  }

  public asociarCategoriaEvento(cate: TipoEvento): Observable<TipoEvento[]> {
    return this._http.post<TipoEvento[]>(`${this.API_URL}asociar-tipo-evento/${cate.evento_id}`, cate)
  }

  public deletTipoEvento(id: number): Observable<TipoEvento[]> {
    return this._http.delete<TipoEvento[]>(`${this.API_URL}delete-tipo-evento/${id}`)
  }



}
