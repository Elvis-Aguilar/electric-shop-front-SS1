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


  validatePositive(libroPedido: productDto): void {
    if (libroPedido.stock < 1) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "No Cantidad menores a cero",
        showConfirmButton: false,
        timer: 1200
      });
      libroPedido.stock = 1;
      return
    }
    if (libroPedido.stock < libroPedido.stock) {
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Valor excede al stock",
        showConfirmButton: false,
        timer: 1200
      });
      libroPedido.stock = libroPedido.stock
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
    this.shoppingService.registerCart(cart).subscribe({
      next: value => {
        this.shoppingService.idResumen = value.id
        this.okShopping()
        this.dataResumen()
      },
      error: err => {
        //manejar el error
        this.dataResumen()
        console.log(err);
      }
    })
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
      this.limpiarItems();
      const cart: CartCreateDto = {
        total: this.total,
        user_id: this.authService.getUsuarioSesion()?.id || 1,
        items: this.itemsCartCreat,
        payment_method: this.paymentMethod,
        password: value.password
      };
      this.saveCart(cart)
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
    this.modalCantidadCompra()

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




}
