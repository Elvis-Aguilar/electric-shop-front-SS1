import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const userComunGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const user = authService.getUsuarioSesion()
  if (user && user?.role === 2) {
    return true;
  }
  Swal.fire(
    'Upss!!',
    'Debes Iniciar Sesion o Registrarte en el sistema :)',
    'info'
  );
  return false;
};

export const regLogGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (authService.getUsuarioSesion()) {
    Swal.fire(
      'Upss!!',
      'Tiene una sesion abierta',
      'info'
    );
    return false;
  }

  return true;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const user = authService.getUsuarioSesion()
  if (user && user?.role === 1) {
    return true;
  }
  Swal.fire(
    'Upss!!',
    'Pagina no encontrada',
    'info'
  );
  return false;
};
