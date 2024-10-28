import { Component, Input, inject } from '@angular/core';
import { Servicio } from '../../../core/models/servicios/servicio';
import { Router } from '@angular/router';
import { ServicioService } from '../../../core/services/servicios/servicio.service';
import { supplier } from '../../../admin/area-provedores/models/supplir.dto';

@Component({
  selector: 'app-card-servicio',
  standalone: true,
  imports: [],
  templateUrl: './card-servicio.component.html',
  styleUrl: './card-servicio.component.css'
})
export class CardServicioComponent {

  @Input() supplier!: supplier;
  imagen!: string;

  private readonly router = inject(Router)

  constructor() { }

  ngOnInit(): void {
    
  }

  goEvento() {
    this.router.navigate(['area-productos/home', `${this.supplier.id}`])
  }
}
