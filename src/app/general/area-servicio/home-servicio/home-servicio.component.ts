import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Servicio } from '../../../core/models/servicios/servicio';
import { AuthService } from '../../../core/services/auth.service';
import { ServicioService } from '../../../core/services/servicios/servicio.service';
import { CardServicioComponent } from '../card-servicio/card-servicio.component';

@Component({
  selector: 'app-home-servicio',
  standalone: true,
  imports: [CardServicioComponent],
  templateUrl: './home-servicio.component.html',
  styleUrl: './home-servicio.component.css'
})
export class HomeServicioComponent {


  servicios: Servicio[] = []

  
  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)
  private readonly servicioService = inject(ServicioService)

  constructor() { }

  ngOnInit(): void {
    this.servicioService.getServiciosTodos().subscribe({
      next: value => {
        this.servicios = value
      }
    })
  }

  goPublicar() {
    this.router.navigate(['personal/formulario-servicio'])
  }
}
