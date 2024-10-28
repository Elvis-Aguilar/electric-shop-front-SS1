import { Routes } from "@angular/router";
import { PerfilComponent } from "./perfil/perfil.component";
import { CarritoComprasComponent } from "./shopping/carrito-compras/carrito-compras.component";
import { ResumenShoppingComponent } from "./shopping/resumen-shopping/resumen-shopping.component";
import { CuentaMonetariaComponent } from "./cuenta-monetaria/cuenta-monetaria.component";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'perfil', pathMatch: 'full' },
    { path: 'perfil', component: PerfilComponent },
    { path: 'shopping', component: CarritoComprasComponent},
    { path: 'shopping/resum-shopping', component: ResumenShoppingComponent},
    { path: 'mis-compras', component: CuentaMonetariaComponent}


];