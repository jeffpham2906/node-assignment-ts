import { Role } from "@prisma/client";
import { IRoleService } from "../interfaces/IRoleService";
import { prisma } from "../lib/prisma";

export class RoleService implements IRoleService {
    onGetRoles = async (): Promise<Role[]> => {
        const data = await prisma.role.findMany();
        return data;
    };
    onGetRole(id: number): Promise<Role> {
        throw new Error("Method not implemented");
    }
    onCreateRole(role: Role): Promise<Role> {
        throw new Error("Method not implemented");
    }
    onUpdateRole(id: number, role: Partial<Role>): Promise<Role> {
        throw new Error("Method not implemented");
    }
    onDeleteRole(id: number): Promise<Role> {
        throw new Error("Method not implemented");
    }
}
