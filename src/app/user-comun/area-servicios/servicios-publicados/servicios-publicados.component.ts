import { Component, inject } from '@angular/core';
import { CardServicioPublicComponent } from '../card-servicio-public/card-servicio-public.component';
import { AuthService } from '../../../core/services/auth.service';
import { ServicioService } from '../../../core/services/servicios/servicio.service';
import { Servicio } from '../../../core/models/servicios/servicio';

@Component({
  selector: 'app-servicios-publicados',
  standalone: true,
  imports: [CardServicioPublicComponent],
  templateUrl: './servicios-publicados.component.html',
  styleUrl: './servicios-publicados.component.css'
})
export class ServiciosPublicadosComponent {

  servicios: Servicio[] = []

  private readonly authService = inject(AuthService)
  private readonly servicioService = inject(ServicioService)

  constructor() { }

  ngOnInit(): void {
    const id: number = this.authService.getUsuarioSesion()?.id || 1
    this.servicioService.getServicosUsuario(id).subscribe({
      next: value => {
        this.servicios = value
      }
    })
  }

}
