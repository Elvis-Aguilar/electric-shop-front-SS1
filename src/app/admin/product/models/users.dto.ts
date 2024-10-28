export interface UserDto {
    id: number;
    name: string;
    email: string;
    cui: string;
    created_at: string;
    role: RoleDto;
}

export interface RoleDto{
    id: number;
    name: string;
    description: string;
}
