export interface TipoEvento {
    alias: string;
    descripcion: string;
    tipo_even_id?: number;
    estado?: number;
    control_tipo_ev_id?: number;
    evento_id?: number;
    tipo_evento?:TipoEvento;

}
