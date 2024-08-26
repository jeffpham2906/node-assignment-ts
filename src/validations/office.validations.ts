import { celebrate, Joi } from "celebrate";

export const officeQuerySchema = celebrate(
    {
        query: Joi.object({
            startDate: Joi.date().iso().messages({
                "date.format": "startDate should follow the format 'YYYY-MM-DD'",
            }),
            endDate: Joi.date().iso().messages({
                "date.format": "endDate should follow the format 'YYYY-MM-DD'",
            }),
            officeCode: Joi.string().optional().messages({
                "string.base": "officeCode should be a string",
            }),
            employeeNumber: Joi.number().positive().optional().messages({
                "number.base": "employeeNumber should be a number",
                "number.positive": "employeeNumber should be a positive number",
            }),
        }),
    },
    { abortEarly: false }
);
