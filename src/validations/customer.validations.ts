import { Customer } from "@prisma/client";
import { Joi } from "celebrate";

const customerName = Joi.string()
    .min(5)
    .max(50)
    .not(null)
    .alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.optional(),
    });

const baseSchema = Joi.object<Customer>({
    // customerNumber: Joi.number()
    //     .integer()
    //     .positive()
    //     .not(null)
    //     .alter({
    //         post: (schema) => schema.required(),
    //         put: (schema) => schema.forbidden(),
    //     }),
    customerName: customerName,
    contactLastName: customerName.min(3),
    contactFirstName: customerName.min(3),
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
    state: Joi.string().min(2).max(50).allow(null).optional(),
    postalCode: Joi.string().min(5).max(15).allow(null).optional(),
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
        .allow(null)
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    creditLimit: Joi.number()
        .precision(2)
        .options({
            convert: true,
        })
        .allow(null)
        .optional(),
});

export const customerSchema = baseSchema.tailor("post");
export const customerSchemaUpdate = baseSchema.tailor("put");
