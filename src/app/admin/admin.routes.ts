import { Routes } from "@angular/router";
import { HomeAdminComponent } from "./home-admin/home-admin.component";



export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'home-admin', pathMatch: 'full' },
    { path: 'home-admin', component: HomeAdminComponent },
];