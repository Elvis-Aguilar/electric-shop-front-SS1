import { Routes } from "@angular/router";
import { HomeAdminComponent } from "./home-admin/home-admin.component";
import { AreaProductosComponent } from "./product/area-productos/area-productos.component";
import { AreaEventosComponent } from "./area-categorias/area-eventos/area-eventos.component";
import { AreaMonetariaComponent } from "./area-monetaria/area-monetaria.component";
import { FormPublicProductoComponent } from "./product/form-public-producto/form-public-producto.component";
import { EditProductoComponent } from "./product/edit-producto/edit-producto.component";
import { FormCreateComponent } from "./area-provedores/form-create/form-create.component";
import { GeneralProveedorsComponent } from "./area-provedores/general-proveedors/general-proveedors.component";
import { ReportSalesComponent } from "./report-sales/report-sales.component";
import { adminGuard } from "../core/guard/auth.guard";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'home-admin', pathMatch: 'full' },
    { path: 'home-admin', component: HomeAdminComponent, canActivate: [adminGuard] },
    { path: 'area-productos', component: AreaProductosComponent, canActivate: [adminGuard] },
    { path: 'area-proveedores', component: GeneralProveedorsComponent, canActivate: [adminGuard] },
    { path: 'area-categoria', component: AreaEventosComponent, canActivate: [adminGuard] },
    { path: 'area-usuarios', component: AreaMonetariaComponent, canActivate: [adminGuard] },
    { path: 'formulario-producto', component: FormPublicProductoComponent, canActivate: [adminGuard] },
    { path: 'edit-producto/:id', component: EditProductoComponent, canActivate: [adminGuard] },
    { path: 'formulario-proveedor', component: FormCreateComponent, canActivate: [adminGuard] },
    { path: 'report-sales', component: ReportSalesComponent, canActivate: [adminGuard] },


];