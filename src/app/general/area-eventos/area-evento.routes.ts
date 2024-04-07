import { Routes } from "@angular/router";
import { HomeEventoComponent } from "./home-evento/home-evento.component";
import { EventoComponent } from "./evento/evento.component";

export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeEventoComponent },
    { path: 'evento/:id', component: EventoComponent }

];