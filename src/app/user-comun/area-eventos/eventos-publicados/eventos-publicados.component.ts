import { Component, inject } from '@angular/core';
import { CardEventoPublicadoComponent } from '../card-evento-publicado/card-evento-publicado.component';
import { AuthService } from '../../../core/services/auth.service';
import { Evento } from '../../../core/models/evento/evento';
import { EventoService } from '../../../core/services/evento/evento.service';

@Component({
  selector: 'app-eventos-publicados',
  standalone: true,
  imports: [CardEventoPublicadoComponent],
  templateUrl: './eventos-publicados.component.html',
  styleUrl: './eventos-publicados.component.css'
})
export class EventosPublicadosComponent {

  eventos: Evento[] = []

  private readonly authService = inject(AuthService)
  private readonly eventoService = inject(EventoService)

  constructor() { }

  ngOnInit(): void {
    const id: number = this.authService.getUsuarioSesion()?.usuario_id || 1
    this.eventoService.getEventosUsuario(id).subscribe({
      next: value => {
        this.eventos = value
      },
      error: err => {
        console.log(err);
      }
    })
  }


}
