import { User } from "@prisma/client";
import { Joi } from "celebrate";

const credentials = {
    username: Joi.string().required().min(3).max(20),
    password: Joi.string()
        .required()
        .min(6)
        .max(100)
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/),
};

const loginSchema = Joi.object<User>(credentials);

const registerSchema = Joi.object<User>({
    ...credentials,
    employeeNumber: Joi.number().required().positive().integer(),
});
export { loginSchema, registerSchema };
