import { Component, Input, inject } from '@angular/core';
import { Evento } from '../../../core/models/evento/evento';
import { EventoService } from '../../../core/services/evento/evento.service';
import { Router } from '@angular/router';
import { categoriaDto } from '../../../admin/area-categorias/models/category.dto';

@Component({
  selector: 'app-card-evento',
  standalone: true,
  imports: [],
  templateUrl: './card-evento.component.html',
  styleUrl: './card-evento.component.css'
})
export class CardEventoComponent {

  @Input() category!: categoriaDto;
  @Input() clase!: string;
  imagen!: string;

  private eventoService = inject(EventoService)
  private readonly router = inject(Router)


  constructor() {
    this.imagen = ''
  }



  goEvento() {
    this.router.navigate(['area-productos/home', `${this.category.id}`])
  }

}
