import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../../core/models/usuario';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  public readonly authService = inject(AuthService);

  constructor(private router: Router) {
    this.authService.getUsuarioSesion();
  }

  goResigster() {
    this.router.navigate(['auth/register']);
  }

  goLogin() {
    this.router.navigate(['auth/login']);
  }

  closeSesion() {

    Swal.fire(
      'Cierre de sesion Exitoso',
      'ECOVOLUN-APP siempre estara contento de servile',
      'success'
    );

    this.authService.closeSesion();
    this.router.navigate(['']);
  }
}
