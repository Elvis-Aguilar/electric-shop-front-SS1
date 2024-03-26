import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/usuario';
import Swal from 'sweetalert2';

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

  imagen!: string;
  usuario: Usuario | undefined = this.authService.getUsuarioSesion()
  content = ''


  constructor() {

  }

  ngOnInit(): void {
    if (this.usuario) {
      const filename: string = this.usuario.url_foto.split('/').pop() || '';
      this.authService.getImage(filename).subscribe(
        (result) => {
          this.createImageFromBlob(result)
        },
        (error) => {
          this.imagen = ''
        }
      )
    } else {
      this.imagen = ''
    }

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

        } else {
          this.msgCamposIncompletos()
        }
      }
    });

  }

  registerCategoria(){
    
  }

  msgCamposIncompletos() {
    Swal.fire(
      'Ups!!',
      'Debes llenar los campos',
      'question'
    );
  }


  goPublicarProductos() {
    this.router.navigate(['personal/formulario-producto'])
  }

  goProductosRegistrados() {
    this.router.navigate(['personal/productos-registrados'])
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
