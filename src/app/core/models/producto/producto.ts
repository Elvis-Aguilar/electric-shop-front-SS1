export interface Producto {
    producto_id:number;
    estado:number;
    nombre:string;
    usuario_vendedor:string;
    fecha_reg_actuli:string;
    descripcion:string;
    especificaciones:string;
    cantidad_exit:number;
    url_foto:string;
    permite_trueque:number;
    permite_contactar:number;
    moneda_local:number;
    moneda_sistema:number;
    producto?:Producto;
}
