import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TipoEvento } from '../../../core/models/evento/tipo-evento';
import { EventoService } from '../../../core/services/evento/evento.service';
import { Evento } from '../../../core/models/evento/evento';
import { CardEventoComponent } from '../card-evento/card-evento.component';

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

  goPublicar() {
    this.router.navigate(['personal/formulario-evento'])
  }
}
