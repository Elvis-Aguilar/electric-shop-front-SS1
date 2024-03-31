import { Component, Input, inject } from '@angular/core';
import { Producto } from '../../core/models/producto';
import { ProductoService } from '../../core/services/producto.service';
import { Router } from '@angular/router';
import { RechazoProducto } from '../../core/models/rechazo-producto';
import Swal from 'sweetalert2';

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
  estado = ''
  rechazoActual!: RechazoProducto

  private readonly productService = inject(ProductoService)
  private readonly router = inject(Router)

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
          this.imagen = ''
        }
      )
    } else {
      this.imagen = ''
    }

    switch (this.producto.estado) {
      case 1:
        this.estado = 'PENDIENTE'
        break;
      case 2:
        this.estado = 'APROBADO'
        break;
      default:
        this.estado = 'RECHAZADO'
        break;
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
    this.router.navigate(['personal/edit-producto/', `${this.producto.producto_id}-${this.producto.nombre}`])
  }

  verMotivoRechazo() {
    this.productService.getMotivoRechazo(this.producto.producto_id).subscribe(
      (result) => {
        this.rechazoActual = result
        this.msgRechazo()
      },
      (error) => {
      }
    )
  }

  msgRechazo() {
    Swal.fire({
      title: '<strong><u>' + this.rechazoActual.alis_estado + '</u></strong>',
      html: `
        <p class="text-xl"> ->  ${this.rechazoActual.descripcion}</p> <hr>
      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }


}
