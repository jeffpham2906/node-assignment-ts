import { celebrate, Joi } from "celebrate";
import { createBodySchema } from "../utils";

const officeQuerySchema = celebrate(
    {
        query: Joi.object({
            startDate: Joi.date().iso().messages({
                "date.format": "startDate should follow the format 'YYYY-MM-DD'"
            }),
            endDate: Joi.date().iso().messages({
                "date.format": "endDate should follow the format 'YYYY-MM-DD'"
            }),
            officeCode: Joi.string().optional().messages({
                "string.base": "officeCode should be a string"
            }),
            employeeNumber: Joi.number().positive().optional().messages({
                "number.base": "employeeNumber should be a number",
                "number.positive": "employeeNumber should be a positive number"
            })
        })
    },
    { abortEarly: false }
);


const officeCreateSchema = createBodySchema(Joi.object({
    officeCode: Joi.string().required().messages({
        "string.base": "officeCode should be a string",
        "any.required": "officeCode is required"
    }),
    city: Joi.string().required().messages({
        "string.base": "city should be a string",
        "any.required": "city is required"
    }),
    phone: Joi.string().required().messages({
        "string.base": "phone should be a string",
        "any.required": "phone is required"
    }),
    addressLine1: Joi.string().required().messages({
        "string.base": "addressLine1 should be a string",
        "any.required": "addressLine1 is required"
    }),
    addressLine2: Joi.string().optional().allow("").messages({
        "string.base": "addressLine2 should be a string"
    }),
    postalCode: Joi.string().required().messages({
        "string.base": "postalCode should be a string",
        "any.required": "postalCode is required"
    }),
    country: Joi.string().required().messages({
        "string.base": "country should be a string",
        "any.required": "country is required"
    }),
    state: Joi.string().required().messages({
        "string.base": "state should be a string",
        "any.required": "state is required"
    }),
    territory: Joi.string().required().messages({
        "string.base": "territory should be a string",
        "any.required": "territory is required"
    })
}));


export { officeQuerySchema, officeCreateSchema };