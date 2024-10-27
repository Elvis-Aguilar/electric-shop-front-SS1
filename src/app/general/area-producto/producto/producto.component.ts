import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { CuentaMonetaria } from '../../../core/models/cuenta-monetaria';
import { productDto } from '../../../admin/product/models/product.dto';
import { ProductService } from '../../../admin/product/services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingServie } from '../../../user-comun/shopping/services/shopping.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {

  @Input('id') productoId!: string;

  producto!: productDto
  imagen!: string;
  statusSesion = false;
  cantida = 1;

  private readonly router = inject(Router)
  private readonly productoService = inject(ProductService)
  private readonly authService = inject(AuthService)
  private readonly shopingService = inject(ShoppingServie)

  constructor() {
    this.statusSesion = this.authService.getUsuarioSesion() ? true : false;
  }

  ngOnInit(): void {
    const param = this.productoId.split('-')[0]
    const id = parseInt(param, 10)
    this.productoService.getById(id).subscribe({
      next: value => {
        this.producto = value
      }
    })

  }

  addCart() {
    if (this.cantida < 1) {
      Swal.fire(
        'upps',
        'No valor incorrecto',
        'info'
      );
      return
    }
    if (this.cantida > this.producto.stock) {
      Swal.fire(
        'upps',
        'No puedes comprar mas productos de los existenes',
        'info'
      );
      return
    }
    const exitProduc = this.shopingService.itemsCart.find(ca => ca.product.id === this.producto.id)
    if (exitProduc) {
      exitProduc.quantity += this.cantida
      exitProduc.subToto += this.cantida * this.producto.price
      Swal.fire(
        'Excelente',
        'Producto agregado con exit',
        'success'
      );
      this.producto.stock = this.producto.stock - this.cantida
      return
    }
    const subTotal = this.producto.price * this.cantida;
    this.shopingService.itemsCart.push({ quantity: this.cantida, product: this.producto, subToto: subTotal })
    this.producto.stock = this.producto.stock - this.cantida
    Swal.fire(
      'Excelente',
      'Producto agregado con exit',
      'success'
    );
  }

  goBack() {
    this.router.navigate(['area-productos/home'])
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




}