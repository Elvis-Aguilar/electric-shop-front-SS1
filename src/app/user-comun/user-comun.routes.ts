import { Routes } from "@angular/router";
import { PerfilComponent } from "./perfil/perfil.component";
import { CarritoComprasComponent } from "./shopping/carrito-compras/carrito-compras.component";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'perfil', pathMatch: 'full' },
    { path: 'perfil', component: PerfilComponent },
    { path: 'shopping', component: CarritoComprasComponent}


];