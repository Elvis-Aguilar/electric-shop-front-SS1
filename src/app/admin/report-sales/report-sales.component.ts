import { Component, inject } from '@angular/core';
import { categoriaDto } from '../area-categorias/models/category.dto';
import { supplier } from '../area-provedores/models/supplir.dto';
import { SupplierService } from '../area-provedores/services/supplier.service';
import { ProductService } from '../product/services/product.service';
import { CategoryService } from '../area-categorias/services/category.service';
import { productDto } from '../product/models/product.dto';
import { UserService } from '../product/services/users.service';
import { UserDto } from '../product/models/users.dto';
import { Cart, CartItem, CartItemRport } from '../../user-comun/shopping/models/cart-reques';
import { ShoppingServie } from '../../user-comun/shopping/services/shopping.service';

@Component({
  selector: 'app-report-sales',
  standalone: true,
  imports: [],
  templateUrl: './report-sales.component.html',
  styleUrl: './report-sales.component.css'
})
export class ReportSalesComponent {

  categories: categoriaDto[] = []
  suppliers: supplier[] = []
  prosucts: productDto[] = []
  userDto: UserDto[] = []
  carts: Cart[] = []
  cartsReports: Cart[] = []
  itemsRport: CartItemRport[] = []
  typeRport = ''
  totalGeneal = 0

  private readonly userService = inject(UserService)
  private readonly shoppingService = inject(ShoppingServie)


  ngOnInit(): void {
    this.getAllUsers()
    this.getAllCarts()
  }

  rportProduct() {
    this.typeRport = 'productGeneral'
    this.itemsRport = []
    this.carts.forEach(cart => {
      if (!cart.description_error) {
        cart.cartItems.forEach(item => {
          const exit = this.itemsRport.find(po => po.product.id === item.product.id)
          if (exit) {
            exit.quantity += Number(item.quantity)
            exit.total += Number(item.sub_total)
          } else {
            this.itemsRport.push({
              product: item.product,
              quantity: Number(item.quantity),
              total: Number(item.sub_total)
            })
          }
        })
      }
    })
  }

  rportProductMayorVentasDesc() {
    this.typeRport = 'productGeneralMayorPromedio';
    this.itemsRport = [];

    this.carts.forEach(cart => {
      if (!cart.description_error) {
        cart.cartItems.forEach(item => {
          const existingProduct = this.itemsRport.find(po => po.product.id === item.product.id);
          if (existingProduct) {
            existingProduct.quantity += Number(item.quantity);
            existingProduct.total += Number(item.sub_total);
          } else {
            this.itemsRport.push({
              product: item.product,
              quantity: Number(item.quantity),
              total: Number(item.sub_total)
            });
          }
        });
      }
    });

    // Ordenar por cantidad (quantity) de forma descendente y obtener los primeros 5 elementos
    this.itemsRport = this.itemsRport
      .sort((a, b) => b.quantity - a.quantity) // Orden descendente
      .slice(0, 5); // Obtener los primeros 5 elementos
  }

  reportGeneralError() {
    this.typeRport = 'errores'

  }

  reportComprasUsuario() {
    this.typeRport = 'users'
  }

  reportGeneral() {
    this.typeRport = 'General'
    this.itemsRport = []
    this.totalGeneal = 0
    this.carts.forEach(cart => {
      if (!cart.description_error) {
        this.totalGeneal += Number(cart.total)
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

  reporClientesMasCompras() {
    this.cartsReports = []
    this.typeRport = 'userMore'
    this.carts.forEach(cart => {
      if (!cart.description_error) {
        const exist = this.cartsReports.find(car => car.user.id === cart.user.id)
        if (exist) {
          exist.total += Number(cart.total)
          exist.id++
        } else { 
          cart.total = Number(cart.total)
          cart.id = 1
          this.cartsReports.push(cart)
        }
      }
    })
  }




  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: value => {
        this.userDto = value
      }
    })
  }



  getAllCarts() {
    this.shoppingService.getAllCart().subscribe({
      next: value => {
        this.carts = value
      }
    })
  }







}
