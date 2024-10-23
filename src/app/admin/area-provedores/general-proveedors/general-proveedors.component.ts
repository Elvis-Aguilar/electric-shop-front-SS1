import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../services/supplier.service';
import { supplier } from '../models/supplir.dto';

@Component({
  selector: 'app-general-proveedors',
  standalone: true,
  imports: [],
  templateUrl: './general-proveedors.component.html',
  styleUrl: './general-proveedors.component.css'
})
export class GeneralProveedorsComponent {

  suppliers: supplier[] = []

  private readonly route = inject(Router)
  private readonly suppliersServices = inject(SupplierService)

  constructor() {
    this.getAllSupliers()
  }

  getAllSupliers() {
    this.suppliersServices.getAllSupplier().subscribe({
      next: value =>{
        this.suppliers = value
      }
    })
  }

  goToCreateProvedor() {
    this.route.navigate(['area-admin/formulario-proveedor'])
  }

}
