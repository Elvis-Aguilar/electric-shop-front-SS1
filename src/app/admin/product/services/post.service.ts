import { Injectable, inject } from "@angular/core";
import { ApiConfigService } from "../../../config/api-config.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CreatePostDto } from "../models/create-post";
import { Post } from "../models/post";
import { AreaSocial } from "../models/area-social";

@Injectable({
    providedIn: 'root'
})
export class PostService {

    private readonly apiConfig = inject(ApiConfigService);
    private readonly _http = inject(HttpClient)


    constructor() { }

    createPost(postCreate: CreatePostDto, idUser: number): Observable<Post> {
        return this._http.post<Post>(`${this.apiConfig.API_POST}/${idUser}`, postCreate)
    }


    getAllPostsByArea(area:string): Observable<Post[]> {
        return this._http.get<Post[]>(`${this.apiConfig.API_POST}/area/${area}`)
    }

}