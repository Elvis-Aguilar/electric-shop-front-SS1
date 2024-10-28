import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiConfigService {

    API_BASE = environment.apiUrl
    API_PAY_METHOD_A = environment.apiPayMethodA
    API_PAY_METHOD_B = environment.apiPayMethodB

    //Session module
    API_AUTH = `${this.API_BASE}/auth`
    API_USER = `${this.API_BASE}/users`

    //business 
    API_PRODUCT = `${this.API_BASE}/products`
    API_CATEGORY = `${this.API_BASE}/categories`
    API_SUPPLIER = `${this.API_BASE}/suppliers`

    //updload file
    API_UPLOAD = `${this.API_BASE}/upload`

    //carts
    API_CART = `${this.API_BASE}/carts`


    
    //report
    API_REPORT = `${this.API_BASE}/reports`
    API_REPORT_USERS = `${this.API_REPORT}/users`

    //callaborator
    API_COLLABORATOR = `${this.API_BASE}/callaborator`
    API_COMPANY = `${this.API_BASE}/companies`

    // dashboard
    API_DASHBOARD = `${this.API_BASE}/dashboard`
}