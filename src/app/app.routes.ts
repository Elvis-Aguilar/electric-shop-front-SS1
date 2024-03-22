import { Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { PageErrorComponent } from './shared/components/page-error/page-error.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'area-admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.AUTH_ROUTES)
        //canActivate: [loggedGuard]
    },
    {
        path: 'area-productos',
        loadChildren: () => import('./general/area-producto/producto.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'personal',
        loadChildren: () => import('./user-comun/user-comun.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '**',
        component: PageErrorComponent,
    }
];
