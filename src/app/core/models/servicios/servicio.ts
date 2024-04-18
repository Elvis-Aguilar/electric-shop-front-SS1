import { Usuario } from "../usuario";

export interface Servicio {
    servicio_id:number;
    estado:number;
    nombre:string;
    usuario_publicador:number;
    descripcion:string;
    permite_contactar:number;
    lugar_realizacion:string;
    url_foto:string;
}
