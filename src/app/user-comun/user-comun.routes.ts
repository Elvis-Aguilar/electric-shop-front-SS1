import { Routes } from "@angular/router";
import { FormPublicProductoComponent } from "./area-productos/form-public-producto/form-public-producto.component";
import { FormPublicEventoComponent } from "./area-eventos/form-public-evento/form-public-evento.component";
import { PerfilComponent } from "./perfil/perfil.component";
import { ProductosPublicadosComponent } from "./area-productos/productos-publicados/productos-publicados.component";
import { EditProductoComponent } from "./area-productos/edit-producto/edit-producto.component";
import { EventosPublicadosComponent } from "./area-eventos/eventos-publicados/eventos-publicados.component";
import { EditEventoComponent } from "./area-eventos/edit-evento/edit-evento.component";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'perfil', pathMatch: 'full' },
    { path: 'formulario-producto', component: FormPublicProductoComponent },
    { path: 'productos-registrados', component: ProductosPublicadosComponent },
    { path: 'formulario-evento', component: FormPublicEventoComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'edit-producto/:id', component: EditProductoComponent },
    { path: 'eventos-registrados', component: EventosPublicadosComponent },
    { path: 'edit-evento/:id', component: EditEventoComponent }


];