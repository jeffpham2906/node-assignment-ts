import { Employee, Prisma, User } from "@prisma/client";
import { celebrate, Joi } from "celebrate";
import { Request } from "express";
import { isDate } from "util/types";
import { QueryParams } from "../interfaces";
import merge from "lodash.merge";

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
export const flattenObject = <T = object>(obj: T): T => {
    let flatted = {} as T;
    for (const key in obj) {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key]) && !isDate(obj[key])) {
            flatted = { ...flatted, ...flattenObject(obj[key]) };
        } else {
            flatted[key] = obj[key];
        }
    }
    return flatted;
};

export function buildQueryParams(query?: QueryParams) {
    const options = {} as Prisma.CustomerFindManyArgs | any;

    if (!query) {
        return options;
    }
    const { page = 1, limit = 10, sort, filter } = query;

    // Pagination
    if (page && limit) {
        options.skip = (page - 1) * limit;
        options.take = limit;
    }

    // Sorting
    if (sort) {
        Object.entries(sort).forEach(([key, value]) => {
            if (value) {
                merge(options, {
                    orderBy: {
                        [key]: value
                    }
                });
            }
        });
    }

    // Filter
    if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
            if (value) {
                if (Array.isArray(value)) {
                    merge(options, {
                        where: {
                            OR: [
                                { [key]: { in: value } }
                            ]
                        }
                    });
                } else {
                    merge(options, {
                        where: {
                            OR: [
                                { [key]: value }
                            ]
                        }
                    });
                }
            }
        });
    }

    return options;
}