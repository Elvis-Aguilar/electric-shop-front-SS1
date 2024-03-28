import { Component, inject } from '@angular/core';
import { ProductoService } from '../../core/services/producto.service';
import { ProductoPendiente } from '../../core/models/producto-pendiente';
import Swal from 'sweetalert2';
import { Usuario } from '../../core/models/usuario';
import { AuthService } from '../../core/services/auth.service';
import { RechazoProducto } from '../../core/models/rechazo-producto';
import { AceptProducto } from '../../core/models/acept-producto';

@Component({
  selector: 'app-area-productos',
  standalone: true,
  imports: [],
  templateUrl: './area-productos.component.html',
  styleUrl: './area-productos.component.css'
})
export class AreaProductosComponent {


  productosPendientes: ProductoPendiente[] = []
  texto = ''
  imagen!: string;


  private readonly productoService = inject(ProductoService)
  private readonly authService = inject(AuthService)


  ngOnInit(): void {
    this.getProductosPendientes()
  }

  getProductosPendientes() {
    this.productoService.getProdcutosPendientes().subscribe(
      (result) => {
        this.productosPendientes = result
      },
      (error) => {

      }
    )
  }

  mostrarUsuario(us: Usuario) {
    const filename: string = us.url_foto.split('/').pop() || '';
    this.authService.getImage(filename).subscribe(
      (result) => {
        this.createImageFromBlobUser(result, us);
      },
      (error) => {
        this.imagen = '';
      }
    );
  }

  mostrarDatosProducto(produc: ProductoPendiente) {
    const filename: string = produc.url_foto.split('/').pop() || '';
    this.productoService.getImage(filename).subscribe(
      (result) => {
        this.createImageFromBlob(result, produc);
      },
      (error) => {
        this.imagen = '';
      }
    );
  }

  private createImageFromBlob(image: Blob, produc: ProductoPendiente) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagen = reader.result as string;
      this.mostrarModal(produc);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  private mostrarModal(produc: ProductoPendiente) {
    const permite_trueque = produc.permite_trueque === 0 ? 'NO' : 'SI'
    Swal.fire({
      title: '<strong><u>' + produc.nombre + '</u></strong>',
      html: `
        <img class="h-64 w-full" src="${this.imagen}" alt="imagen-produto">
        -> <b>${produc.especificaciones}</b> <br> 
        <p class="text-sm"> ->  ${produc.descripcion}</p> <hr>
        ->ms:  <b>${produc.moneda_sistema}</b>, Q:<b> ${produc.moneda_local}</b> <br>
        ->Permite Trueque: <b>${permite_trueque}<b>
      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  private createImageFromBlobUser(image: Blob, us: Usuario) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagen = reader.result as string;
      this.mostrarModalUser(us);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  private mostrarModalUser(us: Usuario) {
    Swal.fire({
      title: '<strong><u>' + us.nombre_completo + '</u></strong>',
      html: `
        <img class="h-64 w-full" src="${this.imagen}" alt="imagen-produto">
       <br> -> <b>${us.nombre_usuario}</b> 

      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  async modalDescripcionRechazo(producto_id: number) {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Motivo del rechazo",
      inputPlaceholder: "Escriba el motivo del rechazo a este producto",
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
      this.saveRechazo(producto_id, text)
    }
  }

  private saveRechazo(producto_id: number, descripcion: string) {
    const rechazo: RechazoProducto = { producto_id, descripcion };
    this.productoService.rechazarProducto(rechazo).subscribe(
      (result) => {
        this.removeProductosPendientes(producto_id)
        this.msgRegistroRechazoOK();
      },
      (error) => {
        console.log(error);
        this.msgError()
      }
    )
  }

  aceptarProducto(usuario_id: number, producto_id: number) {
    const usuario_aprobados: number = 1
    this.productoService.aceptarProducto({ usuario_id, usuario_aprobados, producto_id }).subscribe(
      (result) => {
        this.removeProductosPendientes(producto_id)
        this.msgAceptOK();
      },
      (error) => {
        this.msgError()
      }
    )

  }

  private removeProductosPendientes(producto_id: number) {
    const index = this.productosPendientes.findIndex(producto => producto.producto_id === producto_id)
    if (index !== -1) {
      this.productosPendientes.splice(index, 1)
    }
  }

  msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

  msgRegistroRechazoOK() {
    Swal.fire(
      'Rechazado con exito',
      'El producto fue rechazado con exito y el motivo se le hara saber al usuario',
      'info'
    );
  }

  msgAceptOK() {
    Swal.fire(
      'Aceptado con exito',
      'El producto fue Aceptado con exito, el producto ya podra ser comercializado en el sistema',
      'success'
    );
  }

}
