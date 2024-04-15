import { Evento } from "./evento/evento";
import { Producto } from "./producto/producto";

export interface Reporte {
    reporte_publicacion_id?:number;
    estado?:number;
    evento_id?:number;
    producto_id?:number;
    descripcion:string;
    producto?:Producto;
    evento?:Evento;
}
