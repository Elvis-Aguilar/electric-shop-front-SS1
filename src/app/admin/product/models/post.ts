import { Usuario } from "../../../core/models/usuario";
import { AreaSocial } from "./area-social";

export interface Post {
    id: number;
    content: string;
    created_at: string;
    area_social: AreaSocial;
    user: Usuario;
  }