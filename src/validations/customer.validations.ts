import { Customer } from "@prisma/client";
import { Joi } from "celebrate";

const baseSchema = Joi.object<Customer>({
    customerNumber: Joi.number()
        .integer()
        .positive()
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.forbidden(),
        }),
    customerName: Joi.string()
        .min(5)
        .max(50)
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    contactLastName: Joi.ref("customerName"),
    contactFirstName: Joi.ref("customerName"),
    phone: Joi.string()
        .min(8)
        .max(20)
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    addressLine1: Joi.string()
        .min(10)
        .max(50)
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    addressLine2: Joi.string().min(10).max(50).valid(null).optional(),
    city: Joi.string()
        .min(2)
        .max(50)
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    state: Joi.string().min(2).max(50).valid(null).optional(),
    postalCode: Joi.string().min(5).max(15).valid(null).optional(),
    country: Joi.string()
        .min(2)
        .max(50)
        .not(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    salesRepEmployeeNumber: Joi.number()
        .integer()
        .positive()
        .valid(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    creditLimit: Joi.number()
        .precision(2)
        .options({
            convert: true,
        })
        .valid(null)
        .optional(),
});

export const customerSchema = baseSchema.tailor("post");
export const customerSchemaUpdate = baseSchema.tailor("put");
