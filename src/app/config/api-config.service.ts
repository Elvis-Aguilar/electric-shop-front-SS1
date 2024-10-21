import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiConfigService {

    API_BASE = environment.apiUrl

    //Session module
    API_AUTH = `${this.API_BASE}/auth`
    API_USER = `${this.API_BASE}/users`
    API_PRODUCT = `${this.API_BASE}/products`
    
    //report
    API_REPORT = `${this.API_BASE}/reports`
    API_REPORT_USERS = `${this.API_REPORT}/users`

    //callaborator
    API_COLLABORATOR = `${this.API_BASE}/callaborator`
    API_COMPANY = `${this.API_BASE}/companies`

    // dashboard
    API_DASHBOARD = `${this.API_BASE}/dashboard`
}