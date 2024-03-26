import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../../core/services/producto.service';
import { AuthService } from '../../../core/services/auth.service';
import { Producto } from '../../../core/models/producto';
import { CardProductoComponent } from '../card-producto/card-producto.component';
import { Categoria } from '../../../core/models/categoria';

@Component({
  selector: 'app-home-producto',
  standalone: true,
  imports: [CardProductoComponent],
  templateUrl: './home-producto.component.html',
  styleUrl: './home-producto.component.css'
})
export class HomeProductoComponent {

  productos: Producto[] = []
  categorias: Categoria[] = []
  filter: string = 'Todos'
  descripcion: string = ''

  private readonly router = inject(Router);
  private readonly productoService = inject(ProductoService)
  private readonly authService = inject(AuthService)

  constructor() {
    this.getCategorias();
  }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(
      (result) => {
        if (result) {
          this.productos = result
        }
      },
      (error) => {
        console.error(error);

      });
  }

  goFormPublicar() {
    this.router.navigate(['personal/formulario-producto']);
  }

  getCategorias() {
    this.productoService.getCategories().subscribe(
      (result) => {
        this.categorias = result
      }
    );
  }

  filtrar(categ: Categoria) {
    this.filter = categ.alias
    this.descripcion = categ.descripcion
  }


}
