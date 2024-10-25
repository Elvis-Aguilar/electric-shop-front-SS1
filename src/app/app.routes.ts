import { Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { PageErrorComponent } from './shared/components/page-error/page-error.component';
import { adminGuard, regLogGuard, userComunGuard } from './core/guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
        canActivate: [regLogGuard]
    },
    {
        path: 'area-admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.AUTH_ROUTES),
        canActivate: [adminGuard]
    },
    {
        path: 'area-productos',
        loadChildren: () => import('./general/area-producto/producto.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'area-proveedores',
        loadChildren: () => import('./general/area-servicio/area-servicio.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'area-categorias',
        loadChildren: () => import('./general/area-eventos/area-evento.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'personal',
        loadChildren: () => import('./user-comun/user-comun.routes').then(m => m.AUTH_ROUTES),
        canActivate: [userComunGuard]
    },
    {
        path: '**',
        component: PageErrorComponent,
    }
];
