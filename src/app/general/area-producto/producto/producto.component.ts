import { Component, Input, inject } from '@angular/core';
import { ProductoService } from '../../../core/services/productos/producto.service';
import { Producto } from '../../../core/models/producto/producto';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { Reporte } from '../../../core/models/reporte';
import { CompraProducto } from '../../../core/models/producto/compra-producto';
import { CuentaMonetaria } from '../../../core/models/cuenta-monetaria';

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
      }
    });

    if (text) {
      this.validarCuentaMonetaria(formaPago,text)
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

  private modalConfirCompra(cantidad: number, formaP: number, cuentaMoentari:CuentaMonetaria) {
    const calcluMonetario = formaP === 1 ? cantidad * this.producto.moneda_sistema : cantidad * this.producto.moneda_local
    const tipoPago = formaP === 1 ? 'ms' : 'Q'
    const swalWithBootstrapButtons = Swal.mixin({});
    swalWithBootstrapButtons.fire({
      title: "Confirmar Compra",
      html: `Cantidad de producto a comprar: ${cantidad} <br>
             Total a pagar: ${tipoPago} ${calcluMonetario}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //realizar la compra
        this.realizarCompra(cantidad, formaP,cuentaMoentari)
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

  private realizarCompra(cantidad_comprado:number, formaP: number, cuentaMoentari:CuentaMonetaria){
    let compra: CompraProducto
    if (formaP === 1) {
      compra = {
        usuario_comprador_id: this.authService.getUsuarioSesion()?.usuario_id || 1,
        usuario_vendedor_id: this.producto.usuario_vendedor,
        producto_id: this.producto.producto_id,
        cantidad_comprado,
        total_moneda_ms: cantidad_comprado * this.producto.moneda_sistema,
        total_moneda_local: 0
      } 
      cuentaMoentari.moneda_ms = cuentaMoentari.moneda_ms - (compra.cantidad_comprado * this.producto.moneda_sistema)
    } else{
      compra = {
        usuario_comprador_id: this.authService.getUsuarioSesion()?.usuario_id || 1,
        usuario_vendedor_id: this.producto.usuario_vendedor,
        producto_id: this.producto.producto_id,
        cantidad_comprado,
        total_moneda_local: cantidad_comprado * this.producto.moneda_local,
        total_moneda_ms: 0
      }  
      cuentaMoentari.moneda_local = cuentaMoentari.moneda_local - (compra.cantidad_comprado * this.producto.moneda_local)
    }
    compra.cuenta_monetaria = cuentaMoentari; 
    this.productoService.comprarProducto(compra).subscribe({
      next: value =>{
        this.goBack()        
        this.modalCompra();
      },
      error: err =>{
        this.msgError()
      }
    })
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
   * funcion para validar si me alcanza con el dinero en mi cuenta para comprar
   */
  private  validarCuentaMonetaria(formaP: number, cantidad:number){
    const id = this.authService.getUsuarioSesion()?.usuario_id || 0
    if (id === 0) {
      return
    }
    this.authService.getCuentaMonetaria(id).subscribe({
      next: value => {
        this.validarTotalAGastar(formaP,value, cantidad)
      }
    })
  }

  private validarTotalAGastar(formaP: number, cuentaMoentari:CuentaMonetaria, cantidad: number){
    cuentaMoentari.moneda_local = parseFloat(cuentaMoentari.moneda_local+'')
    cuentaMoentari.moneda_ms = parseFloat(cuentaMoentari.moneda_ms+'')
    const calcluMonetario = formaP === 1 ? cantidad * this.producto.moneda_sistema : cantidad * this.producto.moneda_local
    if (formaP === 1) {
      if (calcluMonetario > cuentaMoentari.moneda_ms) {
        this.msgFondoInvalidos()
        return
      }
    }else{
      if (calcluMonetario > cuentaMoentari.moneda_local) {
        this.msgFondoInvalidos()
        return
      }
    }
    this.modalConfirCompra(cantidad, formaP, cuentaMoentari);
  }

  private msgFondoInvalidos() {
    Swal.fire(
      'No le Alcanza',
      'Usted no cuenta con los fondos necesario para realizar la compra, puede ir a recargar fondos en su cuenta monetaria',
      'info'
    );
  }

  goTrueque(){
    this.router.navigate(['personal/solicitud-trueque/',`${this.producto.producto_id}-${this.producto.nombre}`])
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
