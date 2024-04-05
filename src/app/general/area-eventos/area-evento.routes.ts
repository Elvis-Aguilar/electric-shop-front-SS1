import { Routes } from "@angular/router";
import { HomeEventoComponent } from "./home-evento/home-evento.component";

export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeEventoComponent },
    
];