import { Employee, User } from "@prisma/client";
import { celebrate, Joi } from "celebrate";
import { Request } from "express";

export const getRequiredConditions = (req: Request) => {
    let query;
    const conditions = req.query?.conditions as string[] | undefined;
    const user = (req as any).user as Employee & User;
    if (conditions && !user) {
        throw new Error("This resource is limited to certain users");
    }
    if (conditions && user) {
        query = { conditions, user };
    }
    return query;
};

export const createBodySchema = (schema: Joi.Schema) => celebrate({ body: schema }, { abortEarly: false });
