import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
//import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm!: FormGroup;
  file!: File
  formData!: FormData

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  //private readonly location = inject(Location);

  constructor(private formBuilder: FormBuilder) {
    this.initRegisterFrom()
  }


  initRegisterFrom() {
    this.registerForm = this.formBuilder.group({
      nombre_completo: [null, Validators.required],
      nombre_usuario: [null, Validators.required],
      contrasenia: [null, Validators.required],
      url_foto: [null, Validators.required],
      rol: 2,
      correo: [''],
      face: [''],
      insta: [''],
      linkedin: [''],
      telegram: [''],
      tel: ['']
    })
  }

  register() {
    //registra primero la foto devolviendo el path para guardar el usuario
    this.authService.saveImgUsuario(this.formData).subscribe(
      (result) => {
        this.registerForm.value.url_foto = result.url_foto
        this.registerInfoUser();
      },
      (error) => {
        this.msgError()
      }
    )
  }

  registerInfoUser() {
    this.registerForm.value.contrasenia = CryptoJS.SHA256(this.registerForm.value.contrasenia).toString();
    this.authService.registerUser(this.registerForm.value).subscribe(
      (result) => {
        this.authService.saveSesionNavigate(result)
        this.msgSucces()
        this.initRegisterFrom()
        this.navegarRol()
      },
      (error) => {
        this.msgError()
      }
    )
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement != null && inputElement.files != null && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      this.formData = new FormData();
      this.formData.append('imagen', this.file, this.file.name);
    }
  }

  navegarRol() {
    //this.location.back();
    const usuario = this.authService.getUsuarioSesion()
    if (usuario?.rol === 1) {
      this.router.navigate(['area-admin/home-admin'])
    } else {
      this.router.navigate([''])

    }
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
      'Su registro al sistema ha sido exitoso',
      'success'
    );
  }
}
