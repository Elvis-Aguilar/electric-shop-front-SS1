import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiConfigService } from './api-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UploadImgService {

  private readonly _http = inject(HttpClient)
  private readonly apiConfig = inject(ApiConfigService)

  public saveImg(formData: FormData): Observable<any> {
      return this._http.post<any>(`${this.apiConfig.API_UPLOAD}`, formData);
    }

}