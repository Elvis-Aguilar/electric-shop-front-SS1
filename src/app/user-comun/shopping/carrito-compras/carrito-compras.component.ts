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
  banco: string = 'CREDITO'
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


  getTotalCantidada(): number {
    return 0
  }


  async modalCantidadCompra() {
    const { value: text } = await Swal.fire({
      input: "password",
      inputLabel: "Ingrese su contrasenia del portal de pagos",
      inputPlaceholder: "*******",
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
        this.limpiarItems()
        const cart: CartCreateDto = {
          total: this.total,
          banco: this.banco,
          user_id: this.authService.getUsuarioSesion()?.id || 1,
          items: this.itemsCartCreat,
          payment_method: this.paymentMethod,
          password: result
        }
        //enviar todo
        console.log(cart);

      }
    });
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
    if (this.itemsCart.length === 0) return
    this.modalCantidadCompra()

  }

  private savePedido() {

  }

  private validListBooks(): boolean {
    return true
  }

  private validDireecion(): boolean {
    if (this.direccion === '') {
      Swal.fire({
        title: "Direccion no valida",
        text: "Ingrese una direccion valida para el envio de su pedido",
        icon: "info"
      });
      return true
    }
    return false
  }

  private dataResumen() {

    this.router.navigate(['user/shopping/resum-shopping'])
  }

}
