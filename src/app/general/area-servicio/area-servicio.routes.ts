import { Routes } from "@angular/router";
import { HomeServicioComponent } from "./home-servicio/home-servicio.component";
import { ServicioComponent } from "./servicio/servicio.component";

export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeServicioComponent },
    { path: 'servicio/:id', component: ServicioComponent }
];