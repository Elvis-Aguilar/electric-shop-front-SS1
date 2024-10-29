import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from '../services/supplier.service';
import { supplier } from '../models/supplir.dto';
import Swal from 'sweetalert2';

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

  async goToCreateProvedor() {
    const { value } = await Swal.fire({
      title: 'Ingrese sus datos del proveedor',
      html:
        `<input type="text" id="nombre" class="swal2-input"  placeholder="Nombre" aria-label="Correo electrónico">
         <input type="text" id="descripcion" class="swal2-input" placeholder="Descripcion" aria-label="Contraseña">
         <input type="text" id="address" class="swal2-input" placeholder="direccion" aria-label="Contraseña">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const name = (document.getElementById('nombre') as HTMLInputElement).value;
        const description = (document.getElementById('descripcion') as HTMLInputElement).value;
        const address = (document.getElementById('address') as HTMLInputElement).value; 
        if (!name || !description|| !address) {
          Swal.showValidationMessage('Por favor, ingrese una Datos validos');
          return false;
        }
        return { name, description, address };
      }
    });

    if (value) {
      this.suppliersServices.createSuppliers(value).subscribe({
        next: value =>{
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Proveedor registrado cone exito",
            showConfirmButton: false,
            timer: 1500
          });
          this.getAllSupliers()
        }
      })
    }
  }

}
