import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstadoSidebarService {

  ocultar: boolean = false
  clasComponen = 'flex-grow ml-60 p-3 mt-20'

  constructor() { }

  public cambiarEstado(estado: boolean) {
    this.ocultar = estado
    this.clasComponen = this.ocultar ? 'flex-grow p-3 mt-20' : 'flex-grow ml-60 p-3 mt-20'
  }


}
