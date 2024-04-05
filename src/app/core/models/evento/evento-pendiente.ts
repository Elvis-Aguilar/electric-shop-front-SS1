import { Usuario } from "../usuario";

export interface EventoPendiente {
    evento_id: number;
    estado: number;
    nombre: string;
    usuario_publicador: number;
    descripcion: string;
    permite_contactar: number;
    es_voluntariado: number;
    remunerar_moneda_local: number;
    remunerar_moneda_sitema: number;
    max_participantes: number;
    lugar_realizacion: string;
    url_foto: string;
    fecha_creacion: string;
    fecha_realizacion: string;
    usuario: Usuario;
}
