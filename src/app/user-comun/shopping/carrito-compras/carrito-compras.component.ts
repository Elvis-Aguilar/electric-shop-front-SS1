import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { productDto } from '../../../admin/product/models/product.dto';
import { ShoppingServie } from '../services/shopping.service';
import { cartItem } from '../models/cart-item';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartItemCreateDto } from '../models/cart-item-create.dto';
import { AuthService } from '../../../core/services/auth.service';
import { CartCreateDto } from '../models/cart-create.dto';

@Component({
  selector: 'app-carrito-compras',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './carrito-compras.component.html',
  styleUrl: './carrito-compras.component.css'
})
export class CarritoComprasComponent {

  private readonly shoppingService = inject(ShoppingServie)
  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)


  itemsCart: cartItem[] = this.shoppingService.itemsCart
  direccion: string = ''
  _id: string = '';
  paymentMethod: string = 'PAYPAL'
  itemsCartCreat: CartItemCreateDto[] = []
  total: number = 0

  constructor() {

  }
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.loadPaypalButton();
  }

  // Método para cargar el botón de PayPal si se selecciona PayPal como método de pago
  loadPaypalButton() {
    // Esperamos un momento para asegurarnos de que el SDK de PayPal esté disponible
    if (this.paymentMethod === 'PAYPAL' && (window as any).paypal) {
      // @ts-ignore
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: 'GTQ',
                value: '10.00'
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            alert('Transacción completada por ' + details.payer.name.given_name);
          });
        },
        onError: (err: any) => {
          console.error('Error en la transacción:', err);
        }
      }).render('#paypal-button-container');
    }
  }

  // Método para recargar el botón de PayPal cuando cambia el método de pago
  onPaymentMethodChange() {
    if (this.paymentMethod === 'PAYPAL') {
      this.loadPaypalButton();
    }
  }


  deleteShopping() {
    this.itemsCart.splice(0, this.itemsCart.length)
  }

  removeLibroPedido(index: number): void {
    this.itemsCart.splice(index, 1);
  }

  getTotalSum(): number {
    let tota: number = 0;
    this.itemsCart.forEach(ite => {
      tota += ite.subToto;
    });
    this.total = parseFloat(tota.toFixed(2));
    return this.total;
  }

  private dataResumen() {
    this.deleteShopping()
    this.router.navigate(['personal/shopping/resum-shopping'])
  }

  traducirPayMethod(): string {
    switch (this.paymentMethod) {
      case 'PAYPAL':
        return 'Paypal'
      case 'PAYMENT_GATEWAY_A':
        return 'PasSeguro'
      case 'PAYMENT_GATEWAY_B':
        return 'PasLibre'
      default:
        return 'Paypal'
    }
  }


  saveCart(cart: CartCreateDto) {
    Swal.fire({
      title: 'Realizando compra...',
      text: 'Por favor, espere mientras procesamos su solicitud',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.shoppingService.registerCart(cart).subscribe((blob) => {
      Swal.close();
      if (blob) {
          // Descargar el archivo PDF
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'comprobante.pdf'; // Nombre del archivo descargado
          a.click();
          window.URL.revokeObjectURL(url); // Limpia la URL temporal
          
          this.okShopping();
      } else {
        this.ErrorShopping();
      }
      const id =this.authService.getUsuarioSesion()?.id || 1
      this.shoppingService.findLastCartByUserid(id).subscribe({
        next: value=>{
          this.shoppingService.idResumen = value.id
          this.dataResumen();
        }
      })
  });
  
  }

  async constRealizarCompra(jwt: string) {
    this.limpiarItems()
    const cart: CartCreateDto = {
      total: this.total,
      user_id: this.authService.getUsuarioSesion()?.id || 1,
      items: this.itemsCartCreat,
      payment_method: this.paymentMethod,
      jwt: jwt
    };

    // Mostrar SweetAlert de confirmación
    const result = await Swal.fire({
      title: 'Confirmación de compra',
      html: `
        <p>Total: Q ${cart.total.toFixed(2)}</p>
        <p>Cantidad de artículos: ${cart.items.length}</p>
        <p>Método de pago: ${this.traducirPayMethod()}</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirmar compra',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Si el usuario confirma, limpiar items y guardar el carrito
      this.saveCart(cart);
    }
  }

  loginPasaraleAorB(password: string, email: string) {
    // Mostrar el SweetAlert de carga antes de realizar la solicitud
    Swal.fire({
      title: 'Validando su Usuario',
      text: 'Por favor, espere mientras procesamos su solicitud',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.shoppingService.loginValidUserAOrB({ email, password }, this.paymentMethod).subscribe({
      next: async value => {
        // Cerrar el SweetAlert de carga una vez que la solicitud fue exitosa
        Swal.close();
        console.log(value.jwt);

        // Continuar con el flujo normal de la compra
        this.constRealizarCompra(value.jwt);
      },
      error: err => {
        // Cerrar el SweetAlert de carga en caso de error
        Swal.close();

        // Manejo de errores
        switch (err.status) {
          case 400:
            this.msg400PayapMetod();
            break;
          case 401:
            this.msg401InvalidCredentials();
            break;
          case 404:
            this.msg404EmailNotFound();
            break;
          case 500:
            this.msg500ServerError();
            break;
          default:
            this.msgUnknownError();
        }
      }
    });
  }


  async modalCantidadCompra() {
    const email = this.authService.getUsuarioSesion()?.email || '';

    const { value } = await Swal.fire({
      title: 'Ingrese sus datos del portal de pagos que eligió: ' + this.traducirPayMethod(),
      html:
        `<input type="email" id="email" class="swal2-input" value="${email}" disabled placeholder="Correo electrónico" aria-label="Correo electrónico">
         <input type="password" id="password" class="swal2-input" placeholder="Contraseña" aria-label="Contraseña">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const password = (document.getElementById('password') as HTMLInputElement).value;

        if (!password) {
          Swal.showValidationMessage('Por favor, ingrese una contraseña válida');
          return false;
        }
        return { email, password };
      }
    });

    if (value) {
      //logica de login en pasarales A y B
      this.loginPasaraleAorB(value.password, email)
    }
  }



  limpiarItems() {
    this.itemsCart.forEach(item => {
      this.itemsCartCreat.push({
        quantity: item.quantity,
        product_id: item.product.id,
        sub_total: item.subToto,
      });
    })
  }

  confirmPedido() {
    if (this.itemsCart.length === 0) {
      Swal.fire({
        title: "Upss!",
        text: "El carrito tiene que tener productos",
        icon: "info"
      });
      return
    }
    if (this.paymentMethod === 'PAYMENT_GATEWAY_A' || this.paymentMethod === 'PAYMENT_GATEWAY_B') {
      this.modalCantidadCompra()
    } else {
      //logica para payapl
      this.modalCantidadCompra()
    }

  }

  okShopping() {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Compra Realizada con exit!",
      showConfirmButton: false,
      timer: 1500
    });
  }

  ErrorShopping() {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "La compra no se pudo concretar, error al intentar la transaccion en la pasarela de pagos!, intente mas tarde",
      showConfirmButton: true,
      timer: 2000
    });
  }

  // Mensaje para error 400 - Solicitud incorrecta
  msg400PayapMetod() {
    Swal.fire({
      title: "Ups!!",
      text: "No se ha podido realizar la petición. Por favor, inténtelo más tarde.",
      icon: "info"
    });
  }

  // Mensaje para error 401 - Credenciales inválidas
  msg401InvalidCredentials() {
    Swal.fire({
      title: "Credenciales inválidas",
      text: "El correo o la contraseña son incorrectos. Verifique sus datos e intente nuevamente.",
      icon: "warning"
    });
  }

  // Mensaje para error 404 - Correo no encontrado
  msg404EmailNotFound() {
    Swal.fire({
      title: "Credenciales Invalidas",
      text: "Credenciales invalidas, posiblemente, su correo no se encontro en la pasarela...!",
      icon: "error"
    });
  }

  // Mensaje para error 500 - Error en el servidor
  msg500ServerError() {
    Swal.fire({
      title: "Error en el servidor",
      text: "Ocurrió un problema en el servidor. Por favor, inténtelo más tarde.",
      icon: "error"
    });
  }

  // Mensaje para errores desconocidos
  msgUnknownError() {
    Swal.fire({
      title: "Error desconocido",
      text: "Ocurrió un error inesperado. Por favor, intente nuevamente.",
      icon: "error"
    });
  }




}
