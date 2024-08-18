import { User } from "@prisma/client";
import { IAuthService } from "../interfaces/IAuthService";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export class AuthService implements IAuthService {
    onLogin = async (user: Omit<User, "employeeNumber">): Promise<User> => {
        const loggedInUser = await prisma.user.findFirst({
            where: {
                username: user.username,
            },
            select: {
                employee: {
                    include: {
                        employeeRole: true,
                    },
                },
            },
        });
        if (!loggedInUser) {
            throw new Error("User not found");
        }
        let format = {} as any;
        const { employee, ..._user } = loggedInUser;
        if (employee) {
            const { employeeRole, ..._employee } = employee;
            format = { ...format, ..._employee };
            if (employeeRole) {
                format["permissions"] = [...Array.from(employeeRole.permissions as any)];
            }
        }

        return {
            ..._user,
            ...format,
        };
    };
    onRegister = async (user: User): Promise<User> => {
        user.password = await bcrypt.hash(user.password, 10);
        const createdUser = await prisma.user.create({
            data: user,
        });
        return createdUser;
    };

    onRefreshToken = async (refreshToken: string): Promise<any> => {
        return "ok";
    };
}
