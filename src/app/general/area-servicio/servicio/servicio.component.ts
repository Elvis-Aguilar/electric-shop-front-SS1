import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ServicioService } from '../../../core/services/servicios/servicio.service';
import { Servicio } from '../../../core/models/servicios/servicio';

@Component({
  selector: 'app-servicio',
  standalone: true,
  imports: [],
  templateUrl: './servicio.component.html',
  styleUrl: './servicio.component.css'
})
export class ServicioComponent {

  @Input('id') eventoId!: string;
  statusSesion = false;
  imagen!: string;
  servicio!: Servicio

  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)
  private readonly servicioService = inject(ServicioService)

  constructor() {
    this.statusSesion = this.authService.getUsuarioSesion() ? true : false;
  }

  ngOnInit(): void {
    const param = this.eventoId.split('-')[0]
    const id = parseInt(param, 10)
    this.servicioService.getServicioId(id).subscribe({
      next: value => {
        this.servicio = value
        this.getImagen()
      }
    })
  }


  private getImagen() {
    if (this.servicio) {
      const filename: string = this.servicio.url_foto.split('/').pop() || '';
      this.servicioService.getImage(filename).subscribe({
        next: value => {
          this.createImageFromBlob(value)
        }
      })
    } else {
      this.imagen = ''
    }
  }

  private createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagen = reader.result as string;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  goBack() {
    this.router.navigate(['area-servicios/home'])
  }

  goOfertar(){
    this.router.navigate(['personal/ofertar-servicio', `${this.servicio.servicio_id}-${this.servicio.nombre}`])
  }



}
