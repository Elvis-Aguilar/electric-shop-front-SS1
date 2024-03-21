import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-producto',
  standalone: true,
  imports: [],
  templateUrl: './home-producto.component.html',
  styleUrl: './home-producto.component.css'
})
export class HomeProductoComponent {

  private readonly router = inject(Router);

  constructor() { }


  goFormPublicar() {
    this.router.navigate(['personal/formulario']);
  }

}
