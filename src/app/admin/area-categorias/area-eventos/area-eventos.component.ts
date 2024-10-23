import { Component, inject } from '@angular/core';
import { EventoPendiente } from '../../../core/models/evento/evento-pendiente';
import { EventoService } from '../../../core/services/evento/evento.service';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../../core/models/usuario';
import { TipoEvento } from '../../../core/models/evento/tipo-evento';
import { Reporte } from '../../../core/models/reporte';
import { Evento } from '../../../core/models/evento/evento';
import { CategoryService } from '../services/category.service';
import { categoriaDto } from '../models/category.dto';

@Component({
  selector: 'app-area-eventos',
  standalone: true,
  imports: [],
  templateUrl: './area-eventos.component.html',
  styleUrl: './area-eventos.component.css'
})
export class AreaEventosComponent {


  texto = ''
  imagen!: string;
  eventosPendientes: EventoPendiente[] = []
  tipoEventoPendientes: TipoEvento[] = []
  reportes: Reporte[] = []

  categories: categoriaDto[] = []

  private readonly categoryService = inject(CategoryService)


  ngOnInit(): void {

    this.getAllCategories()
  }


  getAllCategories() {
    this.categoryService.getAll().subscribe({
      next: value => {
        this.categories = value
      }
    })
  }



  /**revisar */

  msgUpdateCategoriaOK(estado: number) {
    if (estado === 2) {
      Swal.fire(
        'Aceptado con exito',
        'La categoria fue Aceptado con exito,  ya podra ser utilizado en el sistema',
        'success'
      );
    } else {
      Swal.fire(
        'Rechazada con exito',
        'La categoria fue Rechazada, esta categoria no aparecera en el sistema',
        'info'
      );
    }

  }

  msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

  msgRegistroRechazoOK() {
    Swal.fire(
      'Rechazado con exito',
      'El evento fue rechazado con exito y el motivo se le hara saber al usuario',
      'info'
    );
  }

  msgAceptOK() {
    Swal.fire(
      'Aceptado con exito',
      'El Evento fue Aceptado con exito, el evento ya estar Publicado en el sistema',
      'success'
    );
  }


  



}
