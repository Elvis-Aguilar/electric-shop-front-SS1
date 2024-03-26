import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-servicio',
  standalone: true,
  imports: [],
  templateUrl: './home-servicio.component.html',
  styleUrl: './home-servicio.component.css'
})
export class HomeServicioComponent {


  private readonly router = inject(Router)

  constructor() { }

  goPublicar() {
    this.router.navigate(['personal/formulario-evento'])
  }
}
