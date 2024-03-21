import { Routes } from "@angular/router";
import { FormPublicProductoComponent } from "./form-public-producto/form-public-producto.component";
import { HomePerfilComponent } from "./home-perfil/home-perfil.component";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePerfilComponent },
    { path: 'formulario', component: FormPublicProductoComponent }

];