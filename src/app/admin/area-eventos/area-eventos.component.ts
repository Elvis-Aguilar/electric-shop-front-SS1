import { Component, inject } from '@angular/core';
import { EventoPendiente } from '../../core/models/evento/evento-pendiente';
import { EventoService } from '../../core/services/evento/evento.service';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../core/models/usuario';
import { TipoEvento } from '../../core/models/evento/tipo-evento';

@Component({
  selector: 'app-area-eventos',
  standalone: true,
  imports: [],
  templateUrl: './area-eventos.component.html',
  styleUrl: './area-eventos.component.css'
})
export class AreaEventosComponent {


  texto = ''
  imagen!: string;
  eventosPendientes: EventoPendiente[] = []
  tipoEventoPendientes: TipoEvento[] = []


  private readonly eventoService = inject(EventoService)
  private readonly authService = inject(AuthService)

  ngOnInit(): void {
    this.getEventosPendientes()
    this.getCategoriasPendientes();
  }

  getEventosPendientes() {
    this.eventoService.getEventosPendientes().subscribe({
      next: value => {
        this.eventosPendientes = value
      },
      error: err => {
      }
    })
  }

  getCategoriasPendientes() {
    this.eventoService.getTipoEventoPendientes().subscribe({
      next: value => { this.tipoEventoPendientes = value },
      error: err => {
        console.log(err);
      }
    });
  }

  mostrarDatosEvento(event: EventoPendiente) {
    const filename: string = event.url_foto.split('/').pop() || '';
    this.eventoService.getImage(filename).subscribe({
      next: value => { this.createImageFromBlob(value, event); },
      error: err => {
        this.imagen = '';
      }
    });
  }

  private createImageFromBlob(image: Blob, event: EventoPendiente) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagen = reader.result as string;
      this.mostrarModal(event);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  private mostrarModal(event: EventoPendiente) {
    const isVoluntarido = event.es_voluntariado ? 'SI' : 'NO'
    Swal.fire({
      title: '<strong><u>' + event.nombre + '</u></strong>',
      html: `
        <img class="h-64 w-full" src="${this.imagen}" alt="imagen-produto">
        -> <b>${event.lugar_realizacion} ${event.fecha_realizacion}</b> <br> 
        <p class="text-sm"> ->  ${event.descripcion}</p> <hr>
        ->ms:  <b>${event.remunerar_moneda_sitema}</b>, Q:<b> ${event.remunerar_moneda_local}</b> <br>
        ->Voluntariado: <b>${isVoluntarido}<b>
      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  mostrarUsuario(us: Usuario) {
    const filename: string = us.url_foto.split('/').pop() || '';
    this.authService.getImage(filename).subscribe(
      (result) => {
        this.createImageFromBlobUser(result, us);
      },
      (error) => {
        this.imagen = '';
      }
    );
  }

  private createImageFromBlobUser(image: Blob, us: Usuario) {
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagen = reader.result as string;
      this.mostrarModalUser(us);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  private mostrarModalUser(us: Usuario) {
    Swal.fire({
      title: '<strong><u>' + us.nombre_completo + '</u></strong>',
      html: `
        <img class="h-64 w-full" src="${this.imagen}" alt="imagen-produto">
       <br> -> <b>${us.nombre_usuario}</b> 

      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  async modalDescripcionRechazo(evento_id: number) {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Motivo del rechazo",
      inputPlaceholder: "Escriba el motivo del rechazo a este producto",
      inputAttributes: {
        "aria-label": "Type your message here"
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
      preConfirm: (result) => {
        if (result === '') {
          Swal.showValidationMessage(
            `Ingrese un nombre valido`
          )
        }
      }
    });
    if (text) {
      this.saveRechazo(evento_id, text)
    }
  }

  private saveRechazo(evento_id: number, descripcion: string) {
    this.eventoService.rechazarEvento({ evento_id, descripcion }).subscribe({
      next: value => {
        this.removeEventoPendientes(evento_id)
        this.msgRegistroRechazoOK();
      },
      error: err => {
        console.log(err);
        this.msgError()
      }
    })
  }

  private removeEventoPendientes(evento_id: number) {
    const index = this.eventosPendientes.findIndex(evento => evento.evento_id === evento_id)
    if (index !== -1) {
      this.eventosPendientes.splice(index, 1)
    }
  }

  aceptarEvento(usuario_id: number, evento_id: number) {
    const usuario_aprobados: number = 1
    this.eventoService.aceptarEvento({ usuario_id, usuario_aprobados, evento_id }).subscribe({
      next: value => {
        this.removeEventoPendientes(evento_id)
        this.msgAceptOK();
      },
      error: err => {
        this.msgError()
        console.log(err);
      }
    })
  }

  mostrarModalTipoEvento(event: TipoEvento) {
    Swal.fire({
      title: '<strong><u>' + event.alias + '</u></strong>',
      html: `
        <p class="text-xl"> ->  ${event.descripcion}</p> <hr>
      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  updateCategoria(event: TipoEvento, estado: number) {
    event.estado = estado;
    this.eventoService.updateCategoria(event).subscribe({
      next: value => {
        const index = this.tipoEventoPendientes.findIndex(tipEvent => tipEvent.tipo_even_id === event.tipo_even_id)
        if (index !== -1) {
          this.tipoEventoPendientes.splice(index, 1)
        }
        this.msgUpdateCategoriaOK(estado);
      },
      error: err => {
        this.msgError()
        console.log(err);
      }
    })
  }

  msgUpdateCategoriaOK(estado: number) {
    if (estado === 2) {
      Swal.fire(
        'Aceptado con exito',
        'La categoria fue Aceptado con exito,  ya podra ser utilizado en el sistema',
        'success'
      );
    } else {
      Swal.fire(
        'Rechazada con exito',
        'La categoria fue Rechazada, esta categoria no aparecera en el sistema',
        'info'
      );
    }

  }

  msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

  msgRegistroRechazoOK() {
    Swal.fire(
      'Rechazado con exito',
      'El evento fue rechazado con exito y el motivo se le hara saber al usuario',
      'info'
    );
  }

  msgAceptOK() {
    Swal.fire(
      'Aceptado con exito',
      'El Evento fue Aceptado con exito, el evento ya estar Publicado en el sistema',
      'success'
    );
  }

}
