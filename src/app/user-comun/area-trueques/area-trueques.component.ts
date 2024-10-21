import { Component, inject } from '@angular/core';
import { ProductoService } from '../../core/services/productos/producto.service';
import { AuthService } from '../../core/services/auth.service';
import { TruequeProducto } from '../../core/models/producto/trueque-producto';
import { Producto } from '../../core/models/producto/producto';
import Swal from 'sweetalert2';
import { Usuario } from '../../core/models/usuario';
import { TruequeProductoServicio } from '../../core/models/evento/trueque-producto-servicio';
import { ServicioService } from '../../core/services/servicios/servicio.service';

@Component({
  selector: 'app-area-trueques',
  standalone: true,
  imports: [],
  templateUrl: './area-trueques.component.html',
  styleUrl: './area-trueques.component.css'
})
export class AreaTruequesComponent {


  private readonly productoService = inject(ProductoService)
  private readonly authService = inject(AuthService)
  private readonly servicioService = inject(ServicioService)

  turequesPendientes: TruequeProducto[] = []
  trueques: TruequeProducto[] = []
  truequesProductoServicio: TruequeProductoServicio[] = []

  imagen!: string;


  ngOnInit(): void {
    const id = this.authService.getUsuarioSesion()?.id || 0
    this.productoService.getSoliciatudTruequeResolver(id).subscribe({
      next: value => {
        this.turequesPendientes = value
      }
    })
    this.productoService.getSoliciatudTrueque(id).subscribe({
      next: value => {
        this.trueques = value
      }
    })
    this.servicioService.getSoliciatudTruequeResolver(id).subscribe({
      next: value => {
        this.truequesProductoServicio = value
        console.log(value);

      }
    })
  }

  ajustarEstado(estod: number): string {
    switch (estod) {
      case 1:
        return 'Pendiente'
      case 2:
        return 'Aceptado'
      case 3:
        return 'Rechazado'
      default:
        return 'Pendiente'
    }
  }

  mostrarDatosProducto(produc?: Producto) {
    if (!produc) {
      return
    }
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

  private createImageFromBlob(image: Blob, produc: Producto) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagen = reader.result as string;
      this.mostrarModal(produc);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  private mostrarModal(produc: Producto) {
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

  mostrarUsuario(us?: Usuario) {
    if (!us) {
      return
    }

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
      title: '<strong><u>' + us.name + '</u></strong>',
      html: `
        <img class="h-64 w-full" src="${this.imagen}" alt="imagen-produto">
       <br> -> <b>${us.name}</b> 

      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  //logica paa aceptar o rechazar
  updateTruequeProducto(opcion: number, trueque: TruequeProducto) {
    if (!this.validaCantidades(opcion, trueque)) {
      this.msgCantidadinvalid()
    }
    trueque.estado = opcion
    this.productoService.updateSolicitudTrueque(trueque).subscribe({
      next: value => {
        this.msgUpdatRgistroTrueque(opcion)
        this.turequesPendientes = value
      },
      error: err => {
        this.msgError();
      }
    })


  }

  private validaCantidades(opcion: number, trueque: TruequeProducto): boolean {
    if (opcion === 3) {
      return true
    }
    if (!trueque.producto_adar || !trueque.producto_solicitado) {
      return false
    }

    if (trueque.producto_adar?.cantidad_exit < trueque.cantidad_dar) {
      return false
    }

    if (trueque.producto_solicitado?.cantidad_exit < trueque.cantdad_solicitar) {
      return false
    }
    return true
  }

  private msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

  private msgCantidadinvalid() {
    Swal.fire(
      'Ups!!',
      'La accion no se puede realizar, revise las cantidades que va intercambiar',
      'error'
    );
  }

  private msgUpdatRgistroTrueque(opcion: number) {
    if (opcion === 2) {
      this.msgRegistroAceptadoOK()
      return
    }
    this.msgRegistroRechazoOK()
  }

  private msgRegistroRechazoOK() {
    Swal.fire(
      'Rechazado con exito',
      'La Solicitud de truque fue rechazad con exito',
      'info'
    );
  }

  private msgRegistroAceptadoOK() {
    Swal.fire(
      'Aceptado con exito',
      'La Solicitud de truque fue aceptado con exito',
      'info'
    );
  }

  //logica de trueque de servicio producto
  updateTruequeProductoServicio(opcion: number, trueque: TruequeProductoServicio) {
    trueque.estado = opcion
    this.servicioService.updateSolicitudTrueque(trueque).subscribe({
      next: value => {
        this.msgUpdatRgistroTrueque(opcion)
        this.truequesProductoServicio = value
      },
      error: err => {
        this.msgError();
      }
    })


  }

}
