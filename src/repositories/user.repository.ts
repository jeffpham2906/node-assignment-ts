import { Prisma, User } from "@prisma/client";
import { IUserRepository } from "../interfaces";
import { prisma } from "../lib/prisma";

export class UserRepository implements IUserRepository {
    private client: Prisma.UserDelegate; // Assuming UserDelegate is the Prisma client's UserDelegate type.
    constructor() {
        this.client = prisma.user;
    }
    findOne = async (id: number): Promise<User | null> => {
        // Implementation
        throw new Error("Method not implemented.");
    };

    findByUsername = async (username: string): Promise<User | null> => {
        // Implementation
        const data = await this.client.findFirst({
            where: { username: username },
            select: {
                username: true,
                password: true,
                employee: {
                    include: {
                        employeeRole: {
                            select: {
                                permissions: true,
                            },
                        },
                    },
                },
            },
        });
        return data as User | null;
    };
    findAll = async (): Promise<User[]> => {
        // Implementation
        throw new Error("Method not implemented.");
    };
    create = async (data: any): Promise<Omit<User, "password">> => {
        return await this.client.create({
            data,
            select: {
                username: true,
                password: false,
                employeeNumber: true,
                employee: true,
            },
        });
    };
    update = async (id: number, data: any): Promise<User> => {
        // Implementation
        throw new Error("Method not implemented.");
    };
    delete = async (id: number): Promise<User> => {
        // Implementation
        throw new Error("Method not implemented.");
    };
}
