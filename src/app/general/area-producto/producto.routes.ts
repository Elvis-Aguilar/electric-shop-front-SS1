import { Routes } from "@angular/router";
import { HomeProductoComponent } from "./home-producto/home-producto.component";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeProductoComponent },
];