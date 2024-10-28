import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Servicio } from '../../../core/models/servicios/servicio';
import { AuthService } from '../../../core/services/auth.service';
import { ServicioService } from '../../../core/services/servicios/servicio.service';
import { CardServicioComponent } from '../card-servicio/card-servicio.component';
import { SupplierService } from '../../../admin/area-provedores/services/supplier.service';
import { supplier } from '../../../admin/area-provedores/models/supplir.dto';

@Component({
  selector: 'app-home-servicio',
  standalone: true,
  imports: [CardServicioComponent],
  templateUrl: './home-servicio.component.html',
  styleUrl: './home-servicio.component.css'
})
export class HomeServicioComponent {



  suppliers: supplier[] = []


  private readonly supplierService = inject(SupplierService)
  private readonly router = inject(Router)

  constructor() { }

  ngOnInit(): void {
    this.getAllSupliers()
  }

  getAllSupliers() {
    this.supplierService.getAllSupplier().subscribe({
      next: value => {
        this.suppliers = value
      }
    })
  }

  goPublicar() {
    this.router.navigate(['personal/formulario-servicio'])
  }
}
