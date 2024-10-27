import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { EstadoSidebarService } from '../../core/services/estado-sidebar.service';
import { RegisterDto } from '../models/register.dto';
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
  private readonly sideBar = inject(EstadoSidebarService)
  //private readonly location = inject(Location);

  constructor(private formBuilder: FormBuilder) {
    this.initRegisterFrom()
  }


  initRegisterFrom() {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      passwordConfirm: [null, Validators.required],
      cui: [null, Validators.required],
      payment_method: [null, Validators.required]
    })
  }

  verifiPasswor(): boolean{
    if (this.registerForm.value.passwordConfirm !== this.registerForm.value.password ) {
      Swal.fire(
        'Contrasenia Incorrecta',
        'Las contrasenias no conciden intente de nuevo',
        'info'
      );
      return false;
    }
    return true;
  }

  validForm():boolean{
    if (!this.registerForm.valid) {
      Swal.fire(
        'Datos incompletos',
        'Todos los datos son obligatorios',
        'question'
      );
      return false
    }

    return true
  }

  transformFormRegisterDto(): RegisterDto{
    return {
      name: this.registerForm.value.name,
      email:this.registerForm.value.email,
      cui: this.registerForm.value.cui+'',
      password:this.registerForm.value.password,
      payment_method: this.registerForm.value.payment_method
    }
  }


  register() {

    if (!this.verifiPasswor() || !this.validForm()) return

    const resterDto = this.transformFormRegisterDto();
    
    this.authService.registerUser(resterDto).subscribe({
      next: value =>{
        this.authService.saveSesionNavigate(value)
        this.msgSucces()
        this.initRegisterFrom()
        this.navegarRol()
        this.sideBar.cambiarEstado(false)
      },
      error: erro =>{
        if (typeof erro.error.message === 'object' && Array.isArray(erro.error.message)) {
          this.msgError(erro.error.message[0]);
        } else {
          this.msgError(erro.error.message);
        }
      }
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

  navegarRol() {
    //this.location.back();
    const usuario = this.authService.getUsuarioSesion()
    if (usuario?.role === 1) {
      this.router.navigate(['area-admin/home-admin'])
    } else {
      this.router.navigate([''])

    }
  }

  msgError(msg:string) {
    Swal.fire(
      'Ups!!',
      'Los valores que a ingresado son incorrectos, intente de nuevo: '+msg,
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
