import { Routes } from "@angular/router";
import { HomeAdminComponent } from "./home-admin/home-admin.component";
import { AreaProductosComponent } from "./area-productos/area-productos.component";
import { AreaEventosComponent } from "./area-eventos/area-eventos.component";
import { AreaMonetariaComponent } from "./area-monetaria/area-monetaria.component";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'home-admin', pathMatch: 'full' },
    { path: 'home-admin', component: HomeAdminComponent },
    { path: 'area-productos', component: AreaProductosComponent },
    { path: 'area-eventos', component: AreaEventosComponent },
    { path: 'area-monetaria', component: AreaMonetariaComponent }

];