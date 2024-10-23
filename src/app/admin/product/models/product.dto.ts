import { categoriaDto } from "../../area-categorias/models/category.dto";
import { supplier } from "../../area-provedores/models/supplir.dto";
import { Status } from "./status";

export interface productDto{
    
    id:number;
    name: string;
    description: string;
    stock: number;
    price: number;
    image: string;
    supplier:supplier;
    category:categoriaDto;
    status: Status;
    created_at: Date;

}