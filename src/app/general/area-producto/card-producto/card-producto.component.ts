import { Component, Input, inject } from '@angular/core';
import { ProductoService } from '../../../core/services/productos/producto.service';
import { Router } from '@angular/router';
import { productDto } from '../../../admin/product/models/product.dto';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-producto',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './card-producto.component.html',
  styleUrl: './card-producto.component.css'
})
export class CardProductoComponent {

  @Input() producto!: productDto;
  imagen!: string;

  private readonly router = inject(Router)

  constructor() {
    this.imagen = ''
  }

  goProducto() {
    this.router.navigate(['area-productos/producto', `${this.producto.id}-${this.producto.name}`])
  }
}
