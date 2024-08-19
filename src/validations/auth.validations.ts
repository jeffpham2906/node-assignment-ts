import { User } from "@prisma/client";
import { Joi } from "celebrate";
import { createBodySchema } from "../utils";

const credentials = {
    username: Joi.string().required().min(3).max(20).messages({
        "string.min": "Username must be at least {#limit} characters long",
        "string.max": "Username must be at most {#limit} characters long",
    }),
    password: Joi.string()
        .required()
        .min(6)
        .max(100)
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)
        .messages({
            "string.min": "Password must be at least {#limit} characters long",
            "string.max": "Password must be at most {#limit} characters long",
            "string.pattern.base":
                "Password must be contain at least one uppercase letter, one lowercase letter, and one number",
        }),
};

const loginSchema = createBodySchema(Joi.object<User>(credentials));

const registerSchema = createBodySchema(
    Joi.object<User>({
        ...credentials,
        employeeNumber: Joi.number()
            .required()
            .positive()
            .integer()
            .message("Employee number must be a positive integer"),
    })
);
export { loginSchema, registerSchema };
