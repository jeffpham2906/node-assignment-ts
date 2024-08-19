import { Customer } from "@prisma/client";
import { Joi } from "celebrate";
import { createBodySchema } from "../utils";

const customerName = Joi.string()
    .min(5)
    .max(50)
    .not(null)
    .messages({
        "string.min": "customerName name must be at least {#limit} characters long",
        "string.max": "customerName name must be at most {#limit} characters long",
        "any.required": "customerName name is required",
    })
    .alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.optional(),
    });

const baseSchema = Joi.object<Customer>({
    customerName: customerName,
    contactLastName: customerName.min(3),
    contactFirstName: customerName.min(3),
    phone: Joi.string()
        .min(8)
        .max(20)
        .not(null)
        .messages({
            "string.min": "Phone number must be at least {#limit} characters long",
            "string.max": "Phone number must be at most {#limit} characters long",
            "any.required": "Phone number is required",
        })
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    addressLine1: Joi.string()
        .min(10)
        .max(50)
        .not(null)
        .messages({
            "string.min": "addressLine1 must be at least {#limit} characters long",
            "string.max": "addressLine1 must be at most {#limit} characters long",
            "any.required": "addressLine1 is required",
        })
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    addressLine2: Joi.string().min(10).max(50).valid(null).optional().messages({
        "string.min": "addressLine2 must be at least {#limit} characters long",
        "string.max": "addressLine2 must be at most {#limit} characters long",
    }),
    city: Joi.string()
        .min(2)
        .max(50)
        .not(null)
        .messages({
            "string.min": "city must be at least {#limit} characters long",
            "string.max": "city must be at most {#limit} characters long",
            "any.required": "city is required",
        })
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    state: Joi.string().min(2).max(50).allow(null).optional().messages({
        "string.min": "state must be at least {#limit} characters long",
        "string.max": "state must be at most {#limit} characters long",
    }),
    postalCode: Joi.string().min(5).max(15).allow(null).optional().messages({
        "string.min": "postalCode must be at least {#limit} characters long",
        "string.max": "postalCode must be at most {#limit} characters long",
    }),
    country: Joi.string()
        .min(2)
        .max(50)
        .not(null)
        .messages({
            "string.min": "country must be at least {#limit} characters long",
            "string.max": "country must be at most {#limit} characters long",
            "any.required": "country is required",
        })
        .alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional(),
        }),
    salesRepEmployeeNumber: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .messages({
            "number.positive": "salesRepEmployeeNumber must be a positive integer",
            "any.required": "salesRepEmployeeNumber is required",
            "number.integer": "salesRepEmployeeNumber must be an integer",
        })
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

export const customerSchema = createBodySchema(baseSchema.tailor("post"));
export const customerSchemaUpdate = createBodySchema(baseSchema.tailor("put"));
