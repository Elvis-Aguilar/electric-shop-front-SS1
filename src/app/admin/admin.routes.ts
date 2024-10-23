import { Routes } from "@angular/router";
import { HomeAdminComponent } from "./home-admin/home-admin.component";
import { AreaProductosComponent } from "./product/area-productos/area-productos.component";
import { AreaEventosComponent } from "./area-categorias/area-eventos/area-eventos.component";
import { AreaMonetariaComponent } from "./area-monetaria/area-monetaria.component";
import { FormPublicProductoComponent } from "./product/form-public-producto/form-public-producto.component";
import { EditProductoComponent } from "./product/edit-producto/edit-producto.component";
import { FormCreateComponent } from "./area-provedores/form-create/form-create.component";
import { GeneralProveedorsComponent } from "./area-provedores/general-proveedors/general-proveedors.component";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'home-admin', pathMatch: 'full' },
    { path: 'home-admin', component: HomeAdminComponent },
    { path: 'area-productos', component: AreaProductosComponent },
    { path: 'area-proveedores', component: GeneralProveedorsComponent },
    { path: 'area-categoria', component: AreaEventosComponent },
    { path: 'area-monetaria', component: AreaMonetariaComponent },
    { path: 'formulario-producto', component: FormPublicProductoComponent },
    { path: 'edit-producto/:id', component: EditProductoComponent },
    { path: 'formulario-proveedor', component: FormCreateComponent }


];