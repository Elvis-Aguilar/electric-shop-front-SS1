import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/usuario';
import Swal from 'sweetalert2';
import { Categoria } from '../../core/models/producto/categoria';
import { ProductoService } from '../../core/services/productos/producto.service';
import { EventoService } from '../../core/services/evento/evento.service';
import { ShoppingServie } from '../shopping/services/shopping.service';
import { Cart } from '../shopping/models/cart-reques';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)
  private readonly shoppingService = inject(ShoppingServie)

  imagen!: string;
  usuario: Usuario | undefined = this.authService.getUsuarioSesion()
  content = ''


  carts: Cart[] = []


  transaccion = false


  constructor() {

  }


  ngOnInit(): void {
    if (this.usuario) {
      this.getAllCartsByUserId(this.usuario.id)
    }

  }

  traducirEstado(stado: string) {
    switch (stado) {
      case 'COMPLETED':
        return 'COMPLETADO'
      case 'CANCELLED_ERROR':
        return 'FALLIDA'
      default:
        return 'FALLIDA'
    }
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

  async crearCateogira() {
    await Swal.fire({
      title: 'Nombre y Descripcion de la Categoria',
      html: `
        <input id="swal-input1" class="swal2-input">
        <br>
        <br>
        <textarea id="swal-input2" class="form-control" aria-label="With textarea"></textarea>
      `,
      focusConfirm: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const alias = (<HTMLInputElement>document.getElementById('swal-input1')).value;
        const descripcion = (<HTMLTextAreaElement>document.getElementById('swal-input2')).value;
        if (alias !== '' && descripcion !== '') {
          //this.registerCategoria(alias, descripcion)
        } else {
          //this.msgCamposIncompletos()
        }
      }
    });

  }

  getAllCartsByUserId(id: number) {
    this.shoppingService.getAllCartUserById(id).subscribe({
      next: value => {
        this.carts = value
      }
    })
  }




  verError(erro: string) {
    Swal.fire(
      'Descripcion del error',
      `${erro}`,
      'warning'
    );
  }

  msgRegistroCategoriaOK() {
    Swal.fire(
      'Registrado con exito',
      'La categoria sera revisada y aprovada por el administrador',
      'success'
    );
  }

  goMisCompras() {
    this.router.navigate(['personal/mis-compras'])
  }

  goTransacciones() {
    this.transaccion = true
  }



}
