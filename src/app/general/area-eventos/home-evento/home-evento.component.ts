import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-evento',
  standalone: true,
  imports: [],
  templateUrl: './home-evento.component.html',
  styleUrl: './home-evento.component.css'
})
export class HomeEventoComponent {

  private router = inject(Router);

  constructor(){}

  goPublicar() {
    this.router.navigate(['personal/formulario-evento'])
  }
}
