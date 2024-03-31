import { Routes } from "@angular/router";
import { FormPublicProductoComponent } from "./form-public-producto/form-public-producto.component";
import { ProductosPublicadosComponent } from "./productos-publicados/productos-publicados.component";
import { FormPublicEventoComponent } from "./form-public-evento/form-public-evento.component";
import { PerfilComponent } from "./perfil/perfil.component";
import { EditProductoComponent } from "./edit-producto/edit-producto.component";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'perfil', pathMatch: 'full' },
    { path: 'formulario-producto', component: FormPublicProductoComponent },
    { path: 'productos-registrados', component: ProductosPublicadosComponent },
    { path: 'formulario-evento', component: FormPublicEventoComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'edit-producto/:id', component: EditProductoComponent }

];