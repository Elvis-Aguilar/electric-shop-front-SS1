import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const sesion: boolean = authService.getUsuarioSesion() ? true : false;
  if (sesion) {
    return true;
  }
  Swal.fire(
    'Upss!!',
    'Debes Iniciar Sesion o Registrarte en el sistema :)',
    'success'
  );
  return false;
};
