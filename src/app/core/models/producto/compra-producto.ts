import { CuentaMonetaria } from "../cuenta-monetaria";

export interface CompraProducto {
    compra_producto_id?: number;
    usuario_comprador_id: number;
    usuario_vendedor_id: number;
    producto_id: number;
    cantidad_comprado: number;
    total_moneda_ms?: number;
    total_moneda_local?: number;
    fecha_compra?: string;
    cuenta_monetaria?:CuentaMonetaria;
}
