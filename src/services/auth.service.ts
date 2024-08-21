import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { IAuthService } from "../interfaces/IAuthService";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../constants";
import { IUserRepository } from "../interfaces";
import { flattenObject } from "../utils";
export class AuthService implements IAuthService {
    private repository: IUserRepository;
    constructor(repository: IUserRepository) {
        this.repository = repository;
    }
    onLogin = async (user: Omit<User, "employeeNumber">): Promise<User> => {
        const loggedInUser = await this.repository.findByUsername(user.username);
        if (!loggedInUser) {
            throw new APIError(
                StatusCodes.NOT_FOUND,
                STATUS_MESSAGES.NOT_FOUND,
                `Cannot find user with username ${user.username}`
            );
        }
        const isCorrectPassword = await bcrypt.compare(user.password, loggedInUser.password);
        if (!isCorrectPassword) {
            throw new APIError(
                StatusCodes.UNAUTHORIZED,
                STATUS_MESSAGES.UNAUTHORIZED,
                `Password not correct with username ${user.username}`
            );
        }
        const { password, ...restUser } = loggedInUser;
        return flattenObject({ ...restUser }) as User;
    };
    onRegister = async (user: User): Promise<User> => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const createdUser = await this.repository.create(user);
        return flattenObject({ ...createdUser }) as User;
    };

    onRefreshToken = async (refreshToken: string): Promise<any> => {
        throw new Error("Method not implemented.");
    };
}
