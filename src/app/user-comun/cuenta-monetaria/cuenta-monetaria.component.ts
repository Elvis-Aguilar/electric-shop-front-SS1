import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ShoppingServie } from '../shopping/services/shopping.service';
import { Usuario } from '../../core/models/usuario';
import { Cart } from '../shopping/models/cart-reques';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuenta-monetaria',
  standalone: true,
  imports: [],
  templateUrl: './cuenta-monetaria.component.html',
  styleUrl: './cuenta-monetaria.component.css'
})
export class CuentaMonetariaComponent {

  private readonly authService = inject(AuthService)
  private readonly shoppingService = inject(ShoppingServie)
  private readonly router = inject(Router)


  usuario: Usuario | undefined = this.authService.getUsuarioSesion()

  carts:Cart[] = []

  constructor() {
  }

  ngOnInit(): void {
    if (this.usuario) {
      this.getAllCartsByUserId(this.usuario.id)
    }
    
  }


  traducirPayMethod(paymentMethod:string): string {
    switch (paymentMethod) {
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

  getAllCartsByUserId(id:number){
    this.shoppingService.getAllCartUserById(id).subscribe({
      next: value =>{
        this.carts = value
      }
    })
  }

  goDetalles(id:number){
    this.shoppingService.idResumen = id
    this.router.navigate(['personal/shopping/resum-shopping'])
  }




}
