import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { HttpClient } from '@angular/common/http';
import { CuentaMonetaria } from '../models/cuenta-monetaria';
import { ApiConfigService } from '../../config/api-config.service';
import { RegisterDto } from '../../auth/models/register.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuarioSesion!: Usuario;

  private readonly _http = inject(HttpClient)

  private readonly apiConing = inject(ApiConfigService)

  public registerUser(us: RegisterDto): Observable<Usuario> {
    return this._http.post<Usuario>(`${this.apiConing.API_AUTH}/sign-up`, us);
  }

  public saveImgUsuario(formData: FormData): Observable<Usuario> {
    return this._http.post<Usuario>(this.apiConing.API_AUTH + 'user-register-foto', formData);
  }

  public UserLogin(us: Usuario) {
    return this._http.post<Usuario>(this.apiConing.API_AUTH + 'user-login', us);
  }

  public getUsers(): Observable<Usuario> {
    return this._http.get<Usuario>(this.apiConing.API_AUTH + 'users');
  }

  public saveSesionNavigate(us: Usuario) {
    localStorage.clear();
    this.usuarioSesion = us;
    localStorage.setItem('sesion_actual', JSON.stringify(us))
  }

  public getImage(filename: string): Observable<Blob> {
    return this._http.get(this.apiConing.API_AUTH + 'user-img/' + filename, { responseType: 'blob' });
  }

  public getUsuarioSesion(): Usuario | undefined {
    if (!this.usuarioSesion) {
      this.usuarioSesion = JSON.parse(localStorage.getItem('sesion_actual')!) || undefined;
    }
    if (this.usuarioSesion) {
      if (this.usuarioSesion.id === undefined) {
        this.usuarioSesion.id = this.usuarioSesion.id
      } else {
        this.usuarioSesion.id = this.usuarioSesion.id
      }
    }

    return this.usuarioSesion;
  }

  public closeSesion() {
    localStorage.clear();
    this.usuarioSesion = JSON.parse(localStorage.getItem('sesion_actual')!) || undefined;
  }

  public getPublicador(id:number): Observable<Usuario> {
    return this._http.get<Usuario>(`${this.apiConing.API_AUTH}user/${id}`);
  }

  public getCuentaMonetaria(id:number): Observable<CuentaMonetaria> {
    return this._http.get<CuentaMonetaria>(`${this.apiConing.API_AUTH}cuenta-monetaria/${id}`);
  }

  public updateCuentaMonetaria(cuenta:CuentaMonetaria): Observable<CuentaMonetaria> {
    return this._http.put<CuentaMonetaria>(`${this.apiConing.API_AUTH}update-cuenta-monetaria/${cuenta.cuenta_monteraia_id}`, cuenta);
  }

}
