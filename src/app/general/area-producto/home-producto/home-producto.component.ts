import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardProductoComponent } from '../card-producto/card-producto.component';
import Swal from 'sweetalert2';
import { ProductService } from '../../../admin/product/services/product.service';
import { productDto } from '../../../admin/product/models/product.dto';
import { CategoryService } from '../../../admin/area-categorias/services/category.service';
import { categoriaDto } from '../../../admin/area-categorias/models/category.dto';

@Component({
  selector: 'app-home-producto',
  standalone: true,
  imports: [CardProductoComponent],
  templateUrl: './home-producto.component.html',
  styleUrl: './home-producto.component.css'
})
export class HomeProductoComponent {

  productos: productDto[] = []
  categorias: categoriaDto[] = []
  filter: string = 'Todos'
  descripcion: string = ''

  private readonly router = inject(Router);
  private readonly productoService = inject(ProductService)
  private readonly categoryService = inject(CategoryService)

  constructor() {
    this.getCategorias();
  }

  ngOnInit(): void {
    this.getProductoTodos()
  }

  getProductoTodos() {
    this.filter = 'Todos'
    this.descripcion = ''
    this.productoService.getAllProduct().subscribe({ 
      next: value =>{
        this.productos = value
      }
    })
  }

  goFormPublicar() {
    this.router.navigate(['personal/formulario-producto']);
  }

  getCategorias() {
   this.categoryService.getAll().subscribe({
    next: value =>{
      this.categorias = value
    }
   })
  }

  filtrarCategoria(categ: categoriaDto) {
    this.filter = categ.name
    this.descripcion = categ.description
    //TODO: filtarar por categoria XD
  }


  msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

}
