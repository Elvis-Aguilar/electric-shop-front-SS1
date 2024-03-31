export interface Categoria {
    alias: string;
    descripcion: string;
    estado?:number;
    categoria_id?: number;
    categoria?:Categoria;
    categoria_producto_id?:number
}
