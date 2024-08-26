import { PrismaClient, User } from "@prisma/client";
import { IUserRepository } from "../interfaces";
import { prisma } from "../lib/prisma";

export class UserRepository implements IUserRepository {
    private client: PrismaClient; // Assuming UserDelegate is the Prisma client's UserDelegate type.
    constructor() {
        this.client = prisma;
    }
    findOne = async (id: number): Promise<User | null> => {
        // Implementation
        throw new Error("Method not implemented.");
    };

    findByUsername = async (username: string): Promise<User | null> => {
        // Implementation
        return this.client.user.findUnique({
            where: { username: username },
            include: {
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
    };
    findAll = async (): Promise<User[]> => {
        // Implementation
        throw new Error("Method not implemented.");
    };
    create = async (data: any): Promise<Omit<User, "password">> => {
        return this.client.user.create({
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
