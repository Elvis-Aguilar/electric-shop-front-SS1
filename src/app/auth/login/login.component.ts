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
    this.authService.UserLogin(this.loginForm.value).subscribe({
      next: value => {
        this.authService.saveSesionNavigate(value)
        this.msgValid();
        this.navegarRol();
        this.sideBar.cambiarEstado(false)
        this.initLoginFrom()
      },
      error: err => {
        if (typeof err.error.message === 'object' && Array.isArray(err.error.message)) {
          this.msgError(err.error.message[0]);
        } else {
          this.msgError(err.error.message);
        }
      }

    })
  }

  navegarRol() {
    const usuario = this.authService.getUsuarioSesion()
    if (usuario?.role === 2) {
      this.router.navigate([''])
    } else {
      this.router.navigate(['area-admin/home-admin'])
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

  msgError(msg: string) {
    Swal.fire(
      'Ups!!',
      'Las credenciales son invalidas: ' + msg,
      'error'
    );
  }


}
