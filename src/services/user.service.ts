import { User } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { IUserService } from "../interfaces";
export class UserService implements IUserService {
    onGetUsers = async (): Promise<User[]> => {
        const data = await prisma.user.findMany({
            select: {
                employeeNumber: true,
                username: true,
            },
        });
        return data as User[];
    };
    onGetUser(id: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
    onCreateUser = async (user: User): Promise<User> => {
        throw new Error("Method not implemented.");
    };
    onUpdateUser(id: number, user: Partial<User>): Promise<User> {
        throw new Error("Method not implemented.");
    }
    onDeleteUser(id: number): Promise<User> {
        throw new Error("Method not implemented.");
    }
}
