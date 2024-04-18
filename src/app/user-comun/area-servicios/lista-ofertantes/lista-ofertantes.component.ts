import { Component, Input, inject } from '@angular/core';
import { Servicio } from '../../../core/models/servicios/servicio';
import { AuthService } from '../../../core/services/auth.service';
import { ServicioService } from '../../../core/services/servicios/servicio.service';
import { Usuario } from '../../../core/models/usuario';
import Swal from 'sweetalert2';
import { Oferta } from '../../../core/models/servicios/oferta';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-ofertantes',
  standalone: true,
  imports: [],
  templateUrl: './lista-ofertantes.component.html',
  styleUrl: './lista-ofertantes.component.css'
})
export class ListaOfertantesComponent {

  @Input('id') productoId!: string;


  ofertas: Oferta[] = []
  imagen!: string;
  ofertaName = ''

  private readonly authService = inject(AuthService)
  private readonly servicioService = inject(ServicioService)
  private readonly router = inject(Router)

  ngOnInit(): void {
    this.ofertaName = this.productoId.split('-')[1]
    const id = this.authService.getUsuarioSesion()?.usuario_id || 0
    this.servicioService.getOfertasUsuario(id).subscribe({
      next: value => {
        this.ofertas = value
      }
    })
  }

  mostrarUsuario(us?: Usuario) {
    if (!us) {
      return
    }
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

  msgOfeta(oferta: Oferta) {
    Swal.fire({
      title: '<strong><u>Oferta</u></strong>',
      html: `
        <p class="text-xl"> ->  ${oferta.descripcion}</p> <hr>
        <p class="text-xl"> -> precio en ms: ${oferta.moneda_ms}</p>
        <p class="text-xl"> -> precio en Q: ${oferta.moneda_local}</p>

      `,
      showCloseButton: true,
      focusConfirm: false,
    });
  }

  //apartado para aceptar o rechazar la oferta
  updateOferta(opcion: number, oferta: Oferta, esMs: number) {
    oferta.estado = opcion
    oferta.servicio_id = esMs
    oferta.moneda_ms = parseFloat(oferta.moneda_ms + '')
    oferta.moneda_local = parseFloat(oferta.moneda_local + '')
    this.servicioService.updateOferta(oferta).subscribe({
      next: value => {
        this.ofertas = value
        this.msgSucces()
      },
      error: err => {
        this.msgError()
      }
    })
  }

  msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

  msgSucces() {
    Swal.fire(
      'Proceso exitoso',
      'Su oferta de servicio ha sido enviado con exito',
      'success'
    );
  }

  goSolicitudIntecambio(id:number){
    this.router.navigate(['personal/solicitud-trueque-servicio', `${this.productoId}-${id}`])
  } 



}
