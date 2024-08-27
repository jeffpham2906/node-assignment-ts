import { PrismaClient, User } from "@prisma/client";
import { IUserRepository } from "../interfaces";
import { prisma } from "../lib/prisma";

export class UserRepository implements IUserRepository {
    private client: PrismaClient; // Assuming UserDelegate is the Prisma client's UserDelegate type.
    constructor() {
        this.client = prisma;
    }

    findByUsername = async (username: string): Promise<User | null> => {
        // Implementation
        return this.client.user.findUnique({
            where: { username },
            include: {
                employee: {
                    include: {
                        employeeRole: {
                            select: {
                                permissions: true
                            }
                        }
                    }
                }
            }
        });
    };
    findAll = async (): Promise<User[]> => {
        return this.client.user.findMany();
    };
    create = async (data: any): Promise<Omit<User, "password">> => {
        return this.client.user.create({
            data,
            select: {
                username: true,
                password: false,
                employeeNumber: true,
                employee: true
            }
        });
    };
    update = async (username: string, data: any): Promise<User> => {
        return this.client.user.update({
            where: {
                username
            },
            data
        });
    };
    delete = async (username: string): Promise<User> => {
        return this.client.user.delete({
            where: {
                username
            }
        });
    };
}
