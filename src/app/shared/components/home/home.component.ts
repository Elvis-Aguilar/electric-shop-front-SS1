import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  private readonly router = inject(Router);

  constructor() { }

  goProductos() {
    this.router.navigate(['area-productos/home'])
  }

  goEventos() {
    this.router.navigate(['area-categorias/home'])
  }

  goServicios() {
    this.router.navigate(['area-proveedores/home'])
  }
}
