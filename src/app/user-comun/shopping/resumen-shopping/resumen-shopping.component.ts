import { Component, inject } from '@angular/core';
import { ShoppingServie } from '../services/shopping.service';
import { Cart } from '../models/cart-reques';

@Component({
  selector: 'app-resumen-shopping',
  standalone: true,
  imports: [],
  templateUrl: './resumen-shopping.component.html',
  styleUrl: './resumen-shopping.component.css'
})
export class ResumenShoppingComponent {

  cart!: Cart
  private readonly shoppingService = inject(ShoppingServie)

  constructor() {
    this.shoppingService.getCartById().subscribe({
      next: value => {
        this.cart = value
      }
    })
  }
  traducirPayMethod(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'PAYPAL':
        return 'Paypal'
      case 'PAYMENT_GATEWAY_A':
        return 'PayFlow'
      case 'PAYMENT_GATEWAY_B':
        return 'SecureFlow'
      default:
        return 'Paypal'
    }
  }



}
