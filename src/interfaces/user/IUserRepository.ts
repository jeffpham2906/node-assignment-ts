import { User } from "@prisma/client";

export interface IUserRepository {
    findByUsername: (username: string) => Promise<User | null>;
    findAll: () => Promise<User[]>;
    create: (data: any) => Promise<Omit<User, "password">>;
    update: (username: string, data: any) => Promise<User>;
    delete: (username: string) => Promise<User>;
}
