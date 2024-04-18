import { Routes } from "@angular/router";
import { FormPublicProductoComponent } from "./area-productos/form-public-producto/form-public-producto.component";
import { FormPublicEventoComponent } from "./area-eventos/form-public-evento/form-public-evento.component";
import { PerfilComponent } from "./perfil/perfil.component";
import { ProductosPublicadosComponent } from "./area-productos/productos-publicados/productos-publicados.component";
import { EditProductoComponent } from "./area-productos/edit-producto/edit-producto.component";
import { EventosPublicadosComponent } from "./area-eventos/eventos-publicados/eventos-publicados.component";
import { EditEventoComponent } from "./area-eventos/edit-evento/edit-evento.component";
import { CuentaMonetariaComponent } from "./cuenta-monetaria/cuenta-monetaria.component";
import { ListaParticipantesComponent } from "./area-eventos/lista-participantes/lista-participantes.component";
import { SolicitudTruequeComponent } from "./area-productos/solicitud-trueque/solicitud-trueque.component";
import { AreaTruequesComponent } from "./area-trueques/area-trueques.component";
import { FormServicioComponent } from "./area-servicios/form-servicio/form-servicio.component";
import { ServiciosPublicadosComponent } from "./area-servicios/servicios-publicados/servicios-publicados.component";
import { OfertarComponent } from "./area-servicios/ofertar/ofertar.component";
import { ListaOfertantesComponent } from "./area-servicios/lista-ofertantes/lista-ofertantes.component";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'perfil', pathMatch: 'full' },
    { path: 'formulario-producto', component: FormPublicProductoComponent },
    { path: 'productos-registrados', component: ProductosPublicadosComponent },
    { path: 'formulario-evento', component: FormPublicEventoComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'edit-producto/:id', component: EditProductoComponent },
    { path: 'eventos-registrados', component: EventosPublicadosComponent },
    { path: 'edit-evento/:id', component: EditEventoComponent },
    { path: 'cuenta-monetaria', component: CuentaMonetariaComponent },
    { path: 'lista-evento/:id', component: ListaParticipantesComponent },
    { path: 'solicitud-trueque/:id', component: SolicitudTruequeComponent },
    { path: 'area-trueques', component: AreaTruequesComponent },
    { path: 'formulario-servicio', component: FormServicioComponent },
    { path: 'servicios-registrados', component: ServiciosPublicadosComponent },
    { path: 'ofertar-servicio/:id', component: OfertarComponent },
    { path: 'lista-ofertantes/:id', component: ListaOfertantesComponent }

];