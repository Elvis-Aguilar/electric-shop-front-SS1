import { Component, Input, inject } from '@angular/core';
import { Servicio } from '../../../core/models/servicios/servicio';
import { Router } from '@angular/router';
import { ServicioService } from '../../../core/services/servicios/servicio.service';

@Component({
  selector: 'app-card-servicio-public',
  standalone: true,
  imports: [],
  templateUrl: './card-servicio-public.component.html',
  styleUrl: './card-servicio-public.component.css'
})
export class CardServicioPublicComponent {

  @Input() servicio!: Servicio;
  imagen!: string;

  private readonly router = inject(Router)
  private readonly servicioServise = inject(ServicioService)

  constructor() { }

  ngOnInit(): void {
    if (!this.servicio) {
      return
    }
    const filename: string = this.servicio.url_foto.split('/').pop() || '';
    this.servicioServise.getImage(filename).subscribe({
      next: value => {
        this.createImageFromBlob(value)
      },
      error: err => { this.imagen = '' }
    })
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagen = reader.result as string;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  goListaOfetnantes(){
    this.router.navigate(['personal/lista-ofertantes', `${this.servicio.servicio_id}-${this.servicio.nombre}`])
  }

}
