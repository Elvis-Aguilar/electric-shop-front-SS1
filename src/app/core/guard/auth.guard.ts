import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
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

export const adminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUsuarioSesion();

  // Rutas protegidas y roles permitidos
  const routeRoles: Record<string, number[]> = {
    '/area-admin/home-admin': [1, 3, 4, 5, 6], // Admin y ayudantes
    '/area-admin/area-productos': [1, 3], //inventario
    '/area-admin/area-proveedores': [1, 3], //inteario (provedores)
    '/area-admin/area-categoria': [1, 3], //inteario (categoria)
    '/area-admin/area-usuarios': [1, 5], //gestion de usuario
    '/area-admin/formulario-producto': [1, 3], //gestion de inventario - crear produto
    '/area-admin/edit-producto': [1, 3], //gestion de inventario - editar produto
    '/area-admin/report-sales': [1, 4, 6], //gestion de reportes y ventas
  };


  if (user) {
    const userRole = user.role;

    // Verificar si el usuario tiene permisos para acceder a la ruta solicitada
    const allowedRoles = routeRoles[state.url];
    console.log(state.url);


    if (allowedRoles && allowedRoles.includes(userRole)) {
      return true;
    } else if (userRole === 1) {
      // Permitir siempre el acceso a los administradores
      return true;
    }
  }

  // Mensaje y redirección en caso de acceso denegado
  Swal.fire('Upss!!', 'No tienes permisos para acceder a esta página', 'info');
  router.navigate(['/area-admin/home-admin']);
  return false;
};
