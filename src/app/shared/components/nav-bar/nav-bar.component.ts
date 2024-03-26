import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../../core/models/usuario';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { EstadoSidebarService } from '../../../core/services/estado-sidebar.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  public readonly authService = inject(AuthService);

  readonly sideBar = inject(EstadoSidebarService)


  constructor(private router: Router) {
    this.authService.getUsuarioSesion();
  }

  goResigster() {
    this.oculatar()
    this.router.navigate(['auth/register']);
  }

  goLogin() {
    this.oculatar()
    this.router.navigate(['auth/login']);
  }

  oculatar() {
    this.sideBar.cambiarEstado(true)
  }

  mostrar() {
    this.sideBar.cambiarEstado(false)
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
