import { celebrate, Joi } from "celebrate";

const getQueryParams = Joi.object({
    page: Joi.number().integer().positive().optional().default(1),
    limit: Joi.number().integer().positive().optional().default(10),
    sort: Joi.any().optional(),
    filter: Joi.any().optional()
}).unknown(true);

export const logQueryParams = celebrate({
    query: Joi.object({
        startDate: Joi.date().iso().messages({
            "date.format": "startDate should follow the format 'YYYY-MM-DD'"
        }),
        endDate: Joi.date().iso().messages({
            "date.format": "endDate should follow the format 'YYYY-MM-DD'"
        }),
        level: Joi.string().optional(),
        user: Joi.any().optional()
    }).unknown(true)
}, { abortEarly: false });

export const validQueryParams = celebrate({
    query: getQueryParams
}, { abortEarly: false });