import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ServicioService } from '../../../core/services/servicios/servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-servicio',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-servicio.component.html',
  styleUrl: './form-servicio.component.css'
})
export class FormServicioComponent {

  registerForm!: FormGroup;
  file!: File
  formData!: FormData

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly servicioService = inject(ServicioService)

  constructor(private formBuilder: FormBuilder) {
    this.initRegisterFrom()
  }

  initRegisterFrom() {
    const idUser = this.authService.getUsuarioSesion()?.usuario_id || 0
    this.registerForm = this.formBuilder.group({
      nombre: [null, Validators.required],
      usuario_publicador: [idUser, Validators.required],
      descripcion: [null, Validators.required],
      permite_contactar: true,
      estado: [2, Validators.required],
      lugar_realizacion: [null, Validators.required],
      url_foto: [null, Validators.required],
    })
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement != null && inputElement.files != null && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      this.formData = new FormData();
      this.formData.append('imagen', this.file, this.file.name);
    }
  }

  register(){
    this.registerForm.value.permite_contactar =  this.registerForm.value.permite_contactar ? 1 : 0
    this.servicioService.saveImgServicio(this.formData).subscribe({
      next: value => {
        this.registerForm.value.url_foto = value.url_foto;
        this.registerServicio()
      },
      error: err => console.error('Observable emitted an error: ' + err),
    })
  }

  registerServicio() {
    this.servicioService.saveServicio(this.registerForm.value).subscribe({
      next: value => {
        this.msgSucces();
        this.router.navigate(['personal/servicios-registrados'])
      },
      error: err => {
        this.msgError();
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
      'Registro Exitoso',
      'Su registro al sistema ha sido exitoso, Debe esperar que el Administrador autorize su Publicacion',
      'success'
    );
  }

}
