import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TipoEvento } from '../../../core/models/evento/tipo-evento';
import { EventoService } from '../../../core/services/evento/evento.service';
import { Evento } from '../../../core/models/evento/evento';
import { CardEventoComponent } from '../card-evento/card-evento.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-evento',
  standalone: true,
  imports: [CardEventoComponent],
  templateUrl: './home-evento.component.html',
  styleUrl: './home-evento.component.css'
})
export class HomeEventoComponent {

  private router = inject(Router);
  private eventoSevice = inject(EventoService)

  tiposEvento: TipoEvento[] = []
  eventos: Evento[] = []
  filter: string = 'Todos'
  descripcion: string = ''

  constructor() { }
  ngOnInit(): void {
    this.getTipoEventos()
    this.getEventosTodos()
  }

  getTipoEventos() {
    this.eventoSevice.getTipoEvento().subscribe({
      next: values => {
        this.tiposEvento = values
      },
      error: err => { }
    })
  }

  getEventosTodos() {
    this.eventoSevice.getEventos().subscribe({
      next: value => {
        this.eventos = value
      },
      error: err => {
        console.error(err);
      }
    })
  }

  filtrarFormaPago(index: number) {
    this.eventoSevice.getEventoFilterFormPago(index).subscribe({
      next: value => { this.eventos = value},
      error: err => {
        this.msgError()
      }
    })
  }

  filtrarCategoria(tipo: TipoEvento) {
    this.filter = tipo.alias
    this.descripcion = tipo.descripcion
    this.eventoSevice.getEventoFilterCategorias(tipo.tipo_even_id || 1).subscribe({
      next: value => {
        this.limpearEventos(value)
      },
      error: err => {
        this.msgError();
      }
    })
  }

  private limpearEventos(result: Evento[]) {
    const eventos: Evento[] = []
    result.forEach(event => {
      if (event.evento) {
        eventos.push(event.evento)
      }
    })
    this.eventos = eventos;    
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
