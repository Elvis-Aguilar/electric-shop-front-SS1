import { Producto } from "../producto/producto";
import { Servicio } from "../servicios/servicio";
import { Usuario } from "../usuario";

export interface TruequeProductoServicio {
    trueque_producto_servicio_id:number;
    estado:number;
    usuario_oferta_id:number;
    usuario_servicio_id:number;
    servicio_intercambiar_id:number;
    producto_intercambiar_id:number;
    cantidad_producto:number;
    producto_intercambiar?:Producto;
    servicio_intercambiar?:Servicio;
}
