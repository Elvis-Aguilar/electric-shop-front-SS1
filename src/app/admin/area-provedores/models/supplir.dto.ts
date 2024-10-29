export interface supplier {
    id:number;
    name: string;
    description: string;
    address: string;
}

export interface supplierCreate {
    name: string;
    description: string;
    address: string;
}