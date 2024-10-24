import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { EstadoSidebarService } from '../../core/services/estado-sidebar.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;

  private readonly authService = inject(AuthService);
  private readonly sideBar = inject(EstadoSidebarService)


  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.initLoginFrom()
  }


  initLoginFrom() {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  goResigster() {
    this.router.navigate(['auth/register']);
  }

  logger() {
    //@dminP4ss/*-
    this.authService.UserLogin(this.loginForm.value).subscribe({
      next: value =>{
        this.authService.saveSesionNavigate(value)
        this.msgValid();
        this.navegarRol();
        this.sideBar.cambiarEstado(false)
        this.initLoginFrom()
      },
      error: err =>{
        this.msgError()

      }
      
    })
  }

  navegarRol() {
    const usuario = this.authService.getUsuarioSesion()
    if (usuario?.role === 1) {
      this.router.navigate(['area-admin/home-admin'])
    } else {
      this.router.navigate([''])

    }
  }

  msgValid() {
    Swal.fire(
      'Inicio de Sesion Exitoso',
      'Bien los datos ingresados son correcto :)',
      'success'
    );
  }

  msgInvalid() {
    Swal.fire(
      'Credenciales invalidas',
      'Los datos ingresados son invalidos :(',
      'info'
    );
  }

  msgError() {
    Swal.fire(
      'Ups!!',
      'Las credenciales son invalidas',
      'error'
    );
  }


}
