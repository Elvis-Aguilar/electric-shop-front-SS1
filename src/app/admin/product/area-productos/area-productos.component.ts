import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { categoriaDto } from '../../area-categorias/models/category.dto';
import { CategoryService } from '../../area-categorias/services/category.service';
import { SupplierService } from '../../area-provedores/services/supplier.service';
import { supplier } from '../../area-provedores/models/supplir.dto';
import { productDto } from '../models/product.dto';
import { ProductService } from '../services/product.service';
import { Status } from '../models/status';

@Component({
  selector: 'app-area-productos',
  standalone: true,
  imports: [],
  templateUrl: './area-productos.component.html',
  styleUrl: './area-productos.component.css'
})
export class AreaProductosComponent {


  categories: categoriaDto[] = []
  suppliers: supplier[] = []
  products: productDto[] = []

  private readonly categoryService = inject(CategoryService)
  private readonly suppliersServices = inject(SupplierService)
  private readonly productService = inject(ProductService)
  private readonly route = inject(Router)


  ngOnInit(): void {
    this.getAllPruducts()
    this.getAllCategories()
    this.getAllSupliers()

  }


  getAllCategories() {
    this.categoryService.getAll().subscribe({
      next: value => {
        this.categories = value
      }
    })
  }

  getAllSupliers() {
    this.suppliersServices.getAllSupplier().subscribe({
      next: value => {
        this.suppliers = value
      }
    })
  }

  getAllPruducts() {
    this.productService.getAllProduct().subscribe({
      next: value => {
        this.products = value
      }
    })
  }


  goFormCrearProducto() {
    this.route.navigate(['area-admin/formulario-producto'])
  }


  getTraductionStatus(status: Status): string {
    switch (status) {
      case Status.AVAILABLE:
        return 'DISPONIBLE'
      case Status.HIDDEN:
        return 'NO DISPONIBLE'
      case Status.OUT_OF_STOCK:
        return 'AGOTADO'
    }
  }

  convertDateToString(created_at: string | Date): string {
    const date = new Date(created_at);  // Asegura que sea un objeto Date
    return date.toISOString().split('T')[0];
  }

  mostrarImg(image: string, name: string) {
    Swal.fire({
      title: `${name}`,
      imageUrl: image
    });
  }

  goEditar(id: number) {
    this.route.navigate(['area-admin/edit-producto', id])
  }

  async deleted(id: number) {
    // Mostrar SweetAlert de confirmación
    const result = await Swal.fire({
      title: 'Confirmación de compra',
      html: `
        <p>Seguro que quiere eliminar el producto</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Si el usuario confirma, limpiar items y guardar el carrito
      this.productService.deletedProduct(id).subscribe({
        next: vale => {
          this.getAllPruducts()
          Swal.fire(
            'Eliminado con exito',
            'El producto se ha eliminado del inventario',
            'warning'
          );
        }
      })
    }

  }



}
