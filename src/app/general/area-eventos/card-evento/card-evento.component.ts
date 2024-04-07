import { Component, Input, inject } from '@angular/core';
import { Evento } from '../../../core/models/evento/evento';
import { EventoService } from '../../../core/services/evento/evento.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-evento',
  standalone: true,
  imports: [],
  templateUrl: './card-evento.component.html',
  styleUrl: './card-evento.component.css'
})
export class CardEventoComponent {

  @Input() evento!: Evento;
  @Input() clase!: string;
  imagen!: string;

  private eventoService = inject(EventoService)
  private readonly router = inject(Router)


  constructor() {
    this.imagen = ''
  }


  ngOnChanges(): void {
    if (this.evento) {
      this.imagen = '';
      const filename: string = this.evento.url_foto.split('/').pop() || '';
      this.eventoService.getImage(filename).subscribe({
        next: value => {this.createImageFromBlob(value)},
        error: err => {}
      });
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

  goEvento() {
    this.router.navigate(['area-eventos/evento', `${this.evento.evento_id}-${this.evento.nombre}`])
  }

}
