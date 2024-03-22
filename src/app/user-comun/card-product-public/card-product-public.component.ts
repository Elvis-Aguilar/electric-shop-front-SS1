import { Component, Input, inject } from '@angular/core';
import { Producto } from '../../core/models/producto';
import { ProductoService } from '../../core/services/producto.service';

@Component({
  selector: 'app-card-product-public',
  standalone: true,
  imports: [],
  templateUrl: './card-product-public.component.html',
  styleUrl: './card-product-public.component.css'
})
export class CardProductPublicComponent {

  @Input() producto!: Producto;
  imagen!: string;

  private readonly productService = inject(ProductoService)

  constructor() {
  }

  ngOnInit(): void {
    if (this.producto) {
      const filename: string = this.producto.url_foto.split('/').pop() || '';
      this.productService.getImage(filename).subscribe(
        (result) => {
          this.createImageFromBlob(result)
        },
        (error) => {
          console.error(error)
        }
      )
    } else {
      this.imagen = ''
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

  editar() {
    console.log(this.producto)
  }
}
