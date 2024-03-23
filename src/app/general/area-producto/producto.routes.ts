import { Routes } from "@angular/router";
import { HomeProductoComponent } from "./home-producto/home-producto.component";
import { ProductoComponent } from "./producto/producto.component";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeProductoComponent },
    { path: 'producto/:id', component: ProductoComponent },
    
];