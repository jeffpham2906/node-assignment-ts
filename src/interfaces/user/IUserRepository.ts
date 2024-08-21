import { User } from "@prisma/client";

export interface IUserRepository {
    findOne: (id: number) => Promise<User | null>;
    findByUsername: (username: string) => Promise<User | null>;
    findAll: () => Promise<User[]>;
    create: (data: any) => Promise<Omit<User, "password">>;
    update: (id: number, data: any) => Promise<User>;
    delete: (id: number) => Promise<User>;
}
