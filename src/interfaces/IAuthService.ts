import { User } from "@prisma/client";

export interface IAuthService {
    onLogin(user: Omit<User, "employeeNumber">): Promise<User>;
    onRegister(user: User): Promise<User>;
    onRefreshToken(refreshToken: string): Promise<any>;
}
