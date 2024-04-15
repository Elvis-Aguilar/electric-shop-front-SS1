import { Component, Input, inject } from '@angular/core';
import { ProductoService } from '../../../core/services/productos/producto.service';
import { Producto } from '../../../core/models/producto/producto';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { Reporte } from '../../../core/models/reporte';
import { CompraProducto } from '../../../core/models/producto/compra-producto';

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

  private saveReporte(descripcion: string) {
    const producto_id = this.producto.producto_id
    const reporte: Reporte = { producto_id, descripcion }
    this.productoService.saveRerporte(reporte).subscribe({
      next: value => {
        this.msgReporteOK();
        this.goBack()
      },
      error: err => {
        this.msgError();
      }
    })
  }

  goBack() {
    this.router.navigate(['area-productos/home'])
  }

  private msgReporteOK() {
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

  //apartado para logica de compra
  async modalCantidadCompra(formaPago: number) {
    const { value: text } = await Swal.fire({
      input: "number",
      inputLabel: "Cantidad de producto a comprar",
      inputPlaceholder: "1",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
      preConfirm: (result) => {
        if (result === '') {
          Swal.showValidationMessage(
            `Ingrese un valor valido`
          )
        }
        result = parseInt(result)
        this.verificacionCantidad(result)
        //verificarCuentaMonetari si me alcanza para comprar esa cantidad XD
      }
    });

    if (text) {
      //calcular descuento en la cuenta si es que cubre
      this.modalConfirCompra(text, formaPago);
    }
  }

  private verificacionCantidad(cantidad: number) {
    if (cantidad <= 0) {
      Swal.showValidationMessage(
        `La cantidad debe ser mayor a 0`
      )
    }
    if (cantidad > this.producto.cantidad_exit) {
      Swal.showValidationMessage(
        `La cantidad supera a la cantidad existente`
      )
    }
  }

  private modalConfirCompra(cantidad: number, formaP: number) {
    const calcluMonetario = formaP === 1 ? cantidad * this.producto.moneda_sistema : cantidad * this.producto.moneda_local
    const tipoPago = formaP === 1 ? 'ms' : 'Q'
    const swalWithBootstrapButtons = Swal.mixin({});
    swalWithBootstrapButtons.fire({
      title: "Confirmar Compra",
      html: `Cantidad de producto a comprar: ${this.producto.cantidad_exit} <br>
             Total a pagar: ${tipoPago} ${calcluMonetario}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.modalCompra();
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Compra Cancelada",
          text: "La compra fue Cancelada",
          icon: "error"
        });
      }
    });
  }

  private realizarCompra(cantidad_comprado:number, formaP: number){
    let compra: CompraProducto
    if (formaP === 1) {
      compra = {
        usuario_comprador_id: this.authService.getUsuarioSesion()?.usuario_id || 1,
        usuario_vendedor_id: this.producto.usuario_vendedor,
        producto_id: this.producto.producto_id,
        cantidad_comprado,
        total_moneda_ms: cantidad_comprado * this.producto.moneda_sistema
      }      
    } else{
      compra = {
        usuario_comprador_id: this.authService.getUsuarioSesion()?.usuario_id || 1,
        usuario_vendedor_id: this.producto.usuario_vendedor,
        producto_id: this.producto.producto_id,
        cantidad_comprado,
        total_moneda_ms: cantidad_comprado * this.producto.moneda_local
      }  
    }
    
  }

  private modalCompra() {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Compra realizada con exito!",
      showConfirmButton: false,
      timer: 1500
    });
  }


  /**
   *  private modalCompra() {
    let timerInterval: any;
    Swal.fire({
      title: "realizando la compra!",
      html: "realizando operaciones  <b></b> milliseconds.",
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup()?.querySelector("b");
        if (timer) {
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Compra realizada con exito!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  }
   */

}
