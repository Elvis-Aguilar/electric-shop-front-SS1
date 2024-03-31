import { Component, Input, inject } from '@angular/core';
import { Producto } from '../../../core/models/producto';
import { ProductoService } from '../../../core/services/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-producto',
  standalone: true,
  imports: [],
  templateUrl: './card-producto.component.html',
  styleUrl: './card-producto.component.css'
})
export class CardProductoComponent {

  @Input() producto!: Producto;
  imagen!: string;

  private readonly productService = inject(ProductoService)
  private readonly router = inject(Router)

  constructor() {
    this.imagen = ''
  }

  ngOnChanges(): void {
    if (this.producto) {
      this.imagen = '';
      const filename: string = this.producto.url_foto.split('/').pop() || '';
      this.productService.getImage(filename).subscribe(
        (result) => {
          this.createImageFromBlob(result);
        },
        (error) => {
          console.error('Error al cargar la imagen:', error);
        }
      );
    }
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagen = reader.result as string;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  goProducto() {
    this.router.navigate(['area-productos/producto', `${this.producto.producto_id}-${this.producto.nombre}`])
  }
}
