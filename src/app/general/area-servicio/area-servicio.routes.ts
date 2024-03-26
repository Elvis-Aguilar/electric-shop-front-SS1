import { Routes } from "@angular/router";
import { HomeServicioComponent } from "./home-servicio/home-servicio.component";

export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeServicioComponent },
    
];