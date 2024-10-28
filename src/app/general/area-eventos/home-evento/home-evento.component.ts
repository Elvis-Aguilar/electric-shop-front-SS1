import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TipoEvento } from '../../../core/models/evento/tipo-evento';
import { EventoService } from '../../../core/services/evento/evento.service';
import { Evento } from '../../../core/models/evento/evento';
import { CardEventoComponent } from '../card-evento/card-evento.component';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../admin/area-categorias/services/category.service';
import { categoriaDto } from '../../../admin/area-categorias/models/category.dto';

@Component({
  selector: 'app-home-evento',
  standalone: true,
  imports: [CardEventoComponent],
  templateUrl: './home-evento.component.html',
  styleUrl: './home-evento.component.css'
})
export class HomeEventoComponent {

  private router = inject(Router);
  private readonly categoryService = inject(CategoryService)

  categorias: categoriaDto[] = []


  constructor() {
  }
  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias() {
    this.categoryService.getAll().subscribe({
     next: value =>{
       this.categorias = value
     }
    })
   }

 

  msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }


  goPublicar() {
    this.router.navigate(['personal/formulario-evento'])
  }
}
