import { Component, inject } from '@angular/core';
import { ProductoService } from '../../core/services/productos/producto.service';
import { ProductoPendiente } from '../../core/models/producto/producto-pendiente';
import Swal from 'sweetalert2';
import { Usuario } from '../../core/models/usuario';
import { AuthService } from '../../core/services/auth.service';
import { RechazoProducto } from '../../core/models/producto/rechazo-producto';
import { AceptProducto } from '../../core/models/producto/acept-producto';
import { Categoria } from '../../core/models/producto/categoria';
import { Reporte } from '../../core/models/reporte';
import { Producto } from '../../core/models/producto/producto';

@Component({
  selector: 'app-area-productos',
  standalone: true,
  imports: [],
  templateUrl: './area-productos.component.html',
  styleUrl: './area-productos.component.css'
})
export class AreaProductosComponent {


  productosPendientes: ProductoPendiente[] = []
  categoriasPendientes: Categoria[] = []
  reportes: Reporte[] = []
  texto = ''
  imagen!: string;
  verGentarl = true;
  id_reporte!: number
  reportesProducto: Reporte[] = []
  productoRevision!: Producto


  private readonly productoService = inject(ProductoService)
  private readonly authService = inject(AuthService)


  ngOnInit(): void {
    this.getProductosPendientes()
    this.getCategoriasPendientes()
    this.getReportesProducto()
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

  getReportesProducto() {
    this.productoService.getReportesProducto().subscribe({
      next: value => {
        this.reportes = value
      }
    })
  }

  getCategoriasPendientes() {
    this.productoService.getCategoriasPendientes().subscribe(
      (result) => {
        this.categoriasPendientes = result
      },
      (error) => {

      }
    )
  }

  mostrarUsuario(us: Usuario) {

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

  mostrarDatosProductoReporte(produc: Producto | undefined) {
    if (produc) {
      const filename: string = produc.url_foto.split('/').pop() || '';
      this.productoService.getImage(filename).subscribe(
        (result) => {
          this.createImageFromBlobR(result, produc);
        },
        (error) => {
          this.imagen = '';
        }
      );
    }
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

  private createImageFromBlobR(image: Blob, produc: Producto) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagen = reader.result as string;
      this.mostrarModalReporte(produc);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  private mostrarModalReporte(produc: Producto) {
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

  mostrarDesReporte(catego: Reporte) {
    Swal.fire({
      title: '<strong><u> Reporte </u></strong>',
      html: `
        <p class="text-xl"> ->  ${catego.descripcion}</p> <hr>
      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  reporteVisto(rep: Reporte) {
    this.productoService.updateReporteVisto({ estado: 2, descripcion: rep.descripcion }, rep.reporte_publicacion_id || 0).subscribe({
      next: value => {
        this.getReportesProducto()
      },
      error: err => {
        this.msgError()
      }
    })
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

  mostrarModalCategoria(catego: Categoria) {
    Swal.fire({
      title: '<strong><u>' + catego.alias + '</u></strong>',
      html: `
        <p class="text-xl"> ->  ${catego.descripcion}</p> <hr>
      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  updateCategoria(categ: Categoria, estado: number) {
    categ.estado = estado;
    this.productoService.updateCategoria(categ).subscribe(
      (result) => {
        this.msgUpdateCategoriaOK(estado);
        const index = this.categoriasPendientes.findIndex(categoria => categoria.categoria_id === categ.categoria_id)
        if (index !== -1) {
          this.categoriasPendientes.splice(index, 1)
        }
      },
      (error) => {
        this.msgError();
      }
    )
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

  msgUpdateCategoriaOK(estado: number) {
    if (estado === 2) {
      Swal.fire(
        'Aceptado con exito',
        'La categoria fue Aceptado con exito,  ya podra ser utilizado en el sistema',
        'success'
      );
    } else {
      Swal.fire(
        'Rechazada con exito',
        'La categoria fue Rechazada, esta categoria no aparecera en el sistema',
        'info'
      );
    }

  }

  verReportesProductoEspecifico(id: number, producto?: Producto){
    if (id === 0 || !producto) {
      return
    }
    this.productoRevision = producto
    this.productoService.getReportesProductoEspecifico(id).subscribe({
      next: value => {
        this.reportesProducto = value
        this.verGentarl = false
      },
      error: err =>{
        this.msgError()
      }
    })
  }

  darDeBajaProducto(id?:number){
    if (!id) {
      return
    }
    this.productoService.darDeBaja({descripcion:'', estado: 4},id).subscribe({
      next: valuer => {
        Swal.fire(
          'Proceso Realizado con exito',
          'El producto fu dado de baja',
          'info'
        );
        this.verGentarl = true
      },
      error: err =>{
        console.log(err);
        this.msgError()
      }
    })
  }

}
