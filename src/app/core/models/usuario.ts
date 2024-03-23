export interface Usuario {
    id:number;
    usuario_id:number;
    nombre_completo:string,
    contrasenia:string,
    nombre_usuario:string,
    url_foto:string,
    info_contacto:string,
    rol: number, 
    correo?: string, 
    face?: string, 
    insta?: string, 
    linkedin?: string, 
    telegram?: string, 
    tel?: number
}
