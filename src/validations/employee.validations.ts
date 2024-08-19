import { Employee } from "@prisma/client";
import { Joi } from "celebrate";
import { createBodySchema } from "../utils";

export const base = Joi.object<Employee>({
    employeeNumber: Joi.number()
        .positive()
        .integer()
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    lastName: Joi.string()
        .min(3)
        .max(50)
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    firstName: Joi.string()
        .min(3)
        .max(50)
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    extension: Joi.string()
        .max(50)
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    email: Joi.string()
        .email()
        .min(10)
        .max(100)
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    officeCode: Joi.string()
        .max(10)
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    role: Joi.string().allow(null).optional(),
    reportsTo: Joi.number().positive().integer().valid(null).optional(),
    jobTitle: Joi.string()
        .valid("President", "Manager", "Leader", "Staff")
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
});

export const employeeSchema = createBodySchema(base.tailor("post"));
export const employeeSchemaUpdate = createBodySchema(base.tailor("put"));
