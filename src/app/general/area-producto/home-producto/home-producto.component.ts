import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../../core/services/productos/producto.service';
import { AuthService } from '../../../core/services/auth.service';
import { Producto } from '../../../core/models/producto/producto';
import { CardProductoComponent } from '../card-producto/card-producto.component';
import { Categoria } from '../../../core/models/producto/categoria';
import Swal from 'sweetalert2';

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
    this.getProductoTodos()
  }

  getProductoTodos() {
    this.filter = 'Todos'
    this.descripcion = ''
    this.productoService.getProductos().subscribe(
      (result) => {
        if (result) {
          this.productos = result
        }
      },
      (error) => {
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

  filtrarCategoria(categ: Categoria) {
    this.filter = categ.alias
    this.descripcion = categ.descripcion
    this.productoService.getProdcutosFilterCategorias(categ.categoria_id || 1).subscribe(
      (result) => {
        this.limpearProductos(result);
      },
      (error) => {
        this.msgError();
      }
    )
  }

  filtrarFormaPago(index: number) {
    if (index >= 4) {
      this.getProductoTodos()
      return
    }
    this.productoService.getProductosFilterFormPago(index).subscribe(
      (result) => {
        this.productos = result;
      },
      (error) => {
        this.msgError();
      }
    )
  }



  private limpearProductos(result: Producto[]) {
    const productos: Producto[] = []
    result.forEach(produ => {
      if (produ.producto) {
        productos.push(produ.producto)
      }
    })
    this.productos = productos;
  }

  msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

}
