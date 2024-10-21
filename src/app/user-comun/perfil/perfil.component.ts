import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/usuario';
import Swal from 'sweetalert2';
import { Categoria } from '../../core/models/producto/categoria';
import { ProductoService } from '../../core/services/productos/producto.service';
import { EventoService } from '../../core/services/evento/evento.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)
  private readonly productoService = inject(ProductoService)
  private readonly eventoService = inject(EventoService)


  imagen!: string;
  usuario: Usuario | undefined = this.authService.getUsuarioSesion()
  content = ''


  constructor() {

  }

  ngOnInit(): void {


  }

  async crearCateogira() {
    await Swal.fire({
      title: 'Nombre y Descripcion de la Categoria',
      html: `
        <input id="swal-input1" class="swal2-input">
        <br>
        <br>
        <textarea id="swal-input2" class="form-control" aria-label="With textarea"></textarea>
      `,
      focusConfirm: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const alias = (<HTMLInputElement>document.getElementById('swal-input1')).value;
        const descripcion = (<HTMLTextAreaElement>document.getElementById('swal-input2')).value;
        if (alias !== '' && descripcion !== '') {
          this.registerCategoria(alias, descripcion)
        } else {
          this.msgCamposIncompletos()
        }
      }
    });

  }

  registerCategoria(alias: string, descripcion: string) {
    const cate: Categoria = { alias, descripcion };
    this.productoService.registrarCategoria(cate).subscribe(
      (result) => {
        this.msgRegistroCategoriaOK()
      },
      (error) => {
        this.msgError()
      }
    );
  }

  async crearTipoEvento() {
    await Swal.fire({
      title: 'Nombre y Descripcion de la Categoria',
      html: `
        <input id="swal-input1" class="swal2-input">
        <br>
        <br>
        <textarea id="swal-input2" class="form-control" aria-label="With textarea"></textarea>
      `,
      focusConfirm: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const alias = (<HTMLInputElement>document.getElementById('swal-input1')).value;
        const descripcion = (<HTMLTextAreaElement>document.getElementById('swal-input2')).value;
        if (alias !== '' && descripcion !== '') {
          this.registerTipoEvento(alias, descripcion)
        } else {
          this.msgCamposIncompletos()
        }
      }
    });

  }

  registerTipoEvento(alias: string, descripcion: string) {
    this.eventoService.registrarTipoEvento({ alias, descripcion }).subscribe({
      next: value => { this.msgRegistroCategoriaOK()},
      error: err => {
        console.log(err);
        this.msgError()
      }
    });
  }

  msgCamposIncompletos() {
    Swal.fire(
      'Ups!!',
      'Debes llenar los campos',
      'question'
    );
  }

  msgRegistroCategoriaOK() {
    Swal.fire(
      'Registrado con exito',
      'La categoria sera revisada y aprovada por el administrador',
      'success'
    );
  }

  goPublicarProductos() {
    this.router.navigate(['personal/formulario-producto'])
  }

  goProductosRegistrados() {
    this.router.navigate(['personal/productos-registrados'])
  }

  goPublicarEvento() {
    this.router.navigate(['personal/formulario-evento'])
  }

  goEventosRegistrados() {
    this.router.navigate(['personal/eventos-registrados'])
  }

  goCuentaMonetaria(){
    this.router.navigate(['personal/cuenta-monetaria']);
  }

  goPublicarServicios() {
    this.router.navigate(['personal/formulario-servicio'])
  }

  goServiciosRegistrados() {
    this.router.navigate(['personal/servicios-registrados'])
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

  msgError() {
    Swal.fire(
      'Ups!!',
      'Ocurrio un error en el servidor: comuniquese con soporte :V',
      'error'
    );
  }

}
