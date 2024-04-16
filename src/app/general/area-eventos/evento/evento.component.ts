import { Component, Input, inject } from '@angular/core';
import { Evento } from '../../../core/models/evento/evento';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EventoService } from '../../../core/services/evento/evento.service';
import { Usuario } from '../../../core/models/usuario';
import Swal from 'sweetalert2';
import { Reporte } from '../../../core/models/reporte';
import { ListaAsistencia } from '../../../core/models/evento/lista-asistencia';

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

  async modalDescripcionRerporte() {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Descripcion del reporte",
      inputPlaceholder: "Escriba una breve descripcion del motivo de su reporte a este Evento",
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
      this.saveReporte(text)
    }
  }

  private saveReporte(descripcion: string) {
    const evento_id = this.evento.evento_id
    const reporte: Reporte = { evento_id, descripcion }
    this.eventoService.saveRerporte(reporte).subscribe({
      next: value => {
        this.msgReporteOK();
        this.goBack()
      },
      error: err => {
        this.msgError();
        console.log(err);
      }
    })
  }

   agragarALista(){
    //validar si ya esta en la lista
    const lista: ListaAsistencia = {
      evento_id: this.evento.evento_id,
      usuario_id: this.authService.getUsuarioSesion()?.usuario_id || 0
    }
    this.eventoService.agregaALista(lista).subscribe({
      next: value =>{
        this.goBack();
        this.msgAddListaOK()
      },
      error: err =>{
        console.error(err);
        this.msgError();
      }
    })

  }


  private msgReporteOK() {
    Swal.fire(
      'Accion Realizada con Exito',
      'El reporte del producto fue reportado con exito, el administrador revisara el producto, Gracias por su ayuda!!',
      'success'
    );
  }

  private msgAddListaOK() {
    Swal.fire(
      'Accion Realizada con Exito',
      'Usted ha sido agrega a la lista de ayuda',
      'success'
    );
  }

  private msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

  goBack() {
    this.router.navigate(['area-eventos/home'])
  }


}
