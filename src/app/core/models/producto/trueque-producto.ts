import { Usuario } from "../usuario";
import { Producto } from "./producto";

export interface TruequeProducto {
    trueque_producto_id: number;
    estado: number;
    usuario_solicitante_id: number;
    usuario_propietario_id: number;
    producto_solicitado_id: number;
    producto_intercambiar_id: number;
    cantidad_dar: number;
    cantdad_solicitar: number;
    producto_adar?: Producto;
    producto_solicitado?: Producto;
    usuario_solicitante?: Usuario
    usuario_propietario?: Usuario


}
