import { Injectable, inject } from "@angular/core";
import { ApiConfigService } from "../../../config/api-config.service";
import { HttpClient } from "@angular/common/http";
import { RoleDto, UserDto } from "../models/users.dto";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly apiConfig = inject(ApiConfigService);
    private readonly _http = inject(HttpClient)


    constructor() { }

    getAllUsers(): Observable<UserDto[]> {
        return this._http.get<UserDto[]>(`${this.apiConfig.API_USER}`)
    }

    getAllUsersByRoleId(id: number): Observable<UserDto[]> {
        return this._http.get<UserDto[]>(`${this.apiConfig.API_USER}/role/${id}`)
    }

    getAllRoles(): Observable<RoleDto[]> {
        return this._http.get<RoleDto[]>(`${this.apiConfig.API_ROLE}`)
    }

    changeRole(iduser: number, idRole: number): Observable<any> {
        return this._http.patch<any>(`${this.apiConfig.API_USER}/user/${iduser}/role/${idRole}`, null)
    }

}  