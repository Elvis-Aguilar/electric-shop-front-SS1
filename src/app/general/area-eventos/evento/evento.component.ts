import { Component, Input, inject } from '@angular/core';
import { Evento } from '../../../core/models/evento/evento';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EventoService } from '../../../core/services/evento/evento.service';
import { Usuario } from '../../../core/models/usuario';

@Component({
  selector: 'app-evento',
  standalone: true,
  imports: [],
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.css'
})
export class EventoComponent {

  @Input('id') eventoId!: string;

  evento!: Evento
  statusSesion = false;
  imagen!: string;
  usuarioPublicador!: Usuario


  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)
  private readonly eventoService = inject(EventoService)


  constructor() {
    this.statusSesion = this.authService.getUsuarioSesion() ? true : false;
  }

  ngOnInit(): void {
    const param = this.eventoId.split('-')[0]
    const id = parseInt(param, 10)
    this.eventoService.getEventoId(id).subscribe({
      next: value => {
        this.evento = value
        this.getImagen()
        this.getPublicador(value.usuario_publicador)
      }
    })

  }

  public getPublicador(idPublicador: number) {
    this.authService.getPublicador(idPublicador).subscribe({
      next: value => {
        this.usuarioPublicador = value
      }
    })
  }

  private getImagen() {
    if (this.evento) {
      const filename: string = this.evento.url_foto.split('/').pop() || '';
      this.eventoService.getImage(filename).subscribe({
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
    this.router.navigate(['area-eventos/home'])
  }


}
