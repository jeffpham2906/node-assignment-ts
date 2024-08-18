import { User } from "@prisma/client";

export interface IUserService {
    onGetUsers(): Promise<User[]>;
    onGetUser(id: number): Promise<User>;
    onCreateUser(user: User): Promise<User>;
    onDeleteUser(id: number): Promise<User>;
    onUpdateUser(id: number, user: Partial<User>): Promise<User>;
}
