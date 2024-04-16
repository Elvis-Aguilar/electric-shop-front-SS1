import { Usuario } from "../usuario"

export interface ListaAsistencia {
    lista_asistencia_id?: number
    usuario_id: number
    evento_id: number 
    estado?: number
    usuario?:Usuario;
}

