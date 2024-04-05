import { Component, Input, inject } from '@angular/core';
import { Evento } from '../../../core/models/evento/evento';
import { Router } from '@angular/router';
import { EventoService } from '../../../core/services/evento/evento.service';

@Component({
  selector: 'app-card-evento-publicado',
  standalone: true,
  imports: [],
  templateUrl: './card-evento-publicado.component.html',
  styleUrl: './card-evento-publicado.component.css'
})
export class CardEventoPublicadoComponent {

  @Input() evento!: Evento;
  imagen!: string;
  estado = ''

  private readonly router = inject(Router)
  private readonly eventosService = inject(EventoService)

  constructor(){}

  ngOnInit(): void {
    if (this.evento) {
      const filename: string = this.evento.url_foto.split('/').pop() || '';
      this.eventosService.getImage(filename).subscribe({
        next: value => {
          this.createImageFromBlob(value)
        },
        error: err => {this.imagen = ''}
      })
    }else{
      this.imagen = ''
    }

    switch (this.evento.estado) {
      case 1:
        this.estado = 'PENDIENTE'
        break;
      case 2:
        this.estado = 'APROBADO'
        break;
      default:
        this.estado = 'RECHAZADO'
        break;
    }
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

}
