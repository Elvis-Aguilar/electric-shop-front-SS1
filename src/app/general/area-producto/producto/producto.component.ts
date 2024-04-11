import { Component, Input, inject } from '@angular/core';
import { ProductoService } from '../../../core/services/productos/producto.service';
import { Producto } from '../../../core/models/producto/producto';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { Reporte } from '../../../core/models/reporte';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {

  @Input('id') productoId!: string;

  producto!: Producto
  imagen!: string;
  statusMonedaSm = 'disabled'
  statusMonedaQ = 'disabled'
  statusTrueque = 'disabled'
  statusSesion = false;

  private readonly router = inject(Router)
  private readonly productoService = inject(ProductoService)
  private readonly authService = inject(AuthService)

  constructor() {
    this.statusSesion = this.authService.getUsuarioSesion() ? true : false;
  }

  ngOnInit(): void {
    const param = this.productoId.split('-')[0]
    const id = parseInt(param, 10)
    this.productoService.getProdcutoId(id).subscribe(
      (result) => {
        this.producto = result
        this.getImagenProducto();
        this.statusMonedaQ = (this.producto.moneda_local === 0) ? 'disabled' : '';
        this.statusMonedaSm = (this.producto.moneda_sistema === 0) ? 'disabled' : '';
        this.statusTrueque = (this.producto.permite_trueque === 0) ? 'disabled' : '';
      },
      (error) => {

      }
    )

  }

  getImagenProducto() {
    if (this.producto) {
      const filename: string = this.producto.url_foto.split('/').pop() || '';
      this.productoService.getImage(filename).subscribe(
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

  async modalDescripcionRerporte() {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Descripcion del reporte",
      inputPlaceholder: "Escriba una breve descripcion del motivo de su reporte a este producto",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
      preConfirm: (result) => {
        if (result === '') {
          Swal.showValidationMessage(
            `Ingrese un nombre valido`
          )
        }
      }
    });
    if (text) {
      this.saveReporte(text)
    }
  }

  private saveReporte(descripcion:string){
    const producto_id = this.producto.producto_id
    const reporte: Reporte = {producto_id,descripcion}
    this.productoService.saveRerporte(reporte).subscribe({
      next: value => {
        this.msgReporteOK();
        this.goBack()
      },
      error:err => {
        this.msgError();
      }
    })
  }

  goBack() {
    this.router.navigate(['area-productos/home'])
  }

  private msgReporteOK(){
    Swal.fire(
      'Accion Realizada con Exito',
      'El reporte del producto fue reportado con exito, el administrador revisara el producto, Gracias por su ayuda!!',
      'success'
    );
  }

  private msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

}
