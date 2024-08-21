import { Employee } from "@prisma/client";
import { Joi } from "celebrate";
import { createBodySchema } from "../utils";

export const base = Joi.object<Employee>({
    employeeNumber: Joi.number()
        .positive()
        .integer()
        .not(null)
        .messages({
            "number.positive": "employeeNumber must be a positive number",
            "number.integer": "employeeNumber must be an integer",
            "any.required": "employeeNumber is required",
            "any.unknown": "employeeNumber should not be changed",
        })
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    lastName: Joi.string()
        .min(3)
        .max(50)
        .not(null)
        .messages({
            "string.min": "lastName must be at least {#limit} characters long",
            "string.max": "lastName must be at most {#limit} characters long",
            "any.required": "lastName is required",
            "any.unknown": "lastName should not be changed",
        })
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    firstName: Joi.string()
        .min(3)
        .max(50)
        .not(null)
        .messages({
            "string.min": "firstName must be at least {#limit} characters long",
            "string.max": "firstName must be at most {#limit} characters long",
            "any.required": "firstName is required",
            "any.unknown": "firstName should not be changed",
        })
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    extension: Joi.string()
        .max(50)
        .not(null)
        .messages({
            "string.max": "extension must be at most {#limit} characters long",
            "any.required": "extension is required",
        })
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    email: Joi.string()
        .email()
        .min(10)
        .max(100)
        .not(null)
        .messages({
            "string.min": "email must be at least {#limit} characters long",
            "string.max": "email must be at most {#limit} characters long",
            "string.email": "email must be a valid email",
            "any.required": "email is required",
        })
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    officeCode: Joi.string()
        .max(10)
        .not(null)
        .messages({
            "string.max": "officeCode must be at most {#limit} characters long",
            "any.required": "officeCode is required",
        })
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    role: Joi.string().allow(null).optional(),
    reportsTo: Joi.number().positive().integer().valid(null).optional(),
    jobTitle: Joi.string()
        .valid("President", "Manager", "Leader", "Staff")
        .messages({
            "any.only": "jobTitle must be one of the following: President, Manager, Leader, Staff",
            "any.required": "jobTitle is required",
        })
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
});

export const employeeSchema = createBodySchema(base.tailor("post"));
export const employeeSchemaUpdate = createBodySchema(base.tailor("put"));
