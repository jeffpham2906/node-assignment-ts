import { Role } from "@prisma/client";

export interface IRoleService {
    onGetRoles(): Promise<Role[]>;
    onGetRole(id: number): Promise<Role>;
    onCreateRole(role: Role): Promise<Role>;
    onDeleteRole(id: number): Promise<Role>;
    onUpdateRole(id: number, role: Partial<Role>): Promise<Role>;
}
