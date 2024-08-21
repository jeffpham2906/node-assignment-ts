import { Customer, Prisma } from "@prisma/client";
import { ICustomerRepository } from "../interfaces";
import { prisma } from "../lib/prisma";
import merge from "lodash.merge";
export class CustomerRepository implements ICustomerRepository {
    private client: Prisma.CustomerDelegate;
    constructor() {
        this.client = prisma.customer;
    }
    get = async (customerNumber: number, options: Prisma.CustomerFindFirstArgs = {}): Promise<Customer | null> => {
        const getOptions = merge({ where: { customerNumber } }, options);
        const data = await this.client.findFirst(getOptions);
        return data;
    };
    getAll = async (options: Prisma.CustomerFindManyArgs): Promise<Customer[]> => {
        return await this.client.findMany(options);
    };
    create = async (data: Customer): Promise<Customer> => {
        return await this.client.create({ data });
    };
    update = async (
        customerNumber: number,
        data: Partial<Customer>,
        options?: Prisma.CustomerUpdateArgs
    ): Promise<Customer> => {
        const updateOptions = merge(
            {
                where: {
                    customerNumber,
                },
                data,
                include: {
                    employee: true,
                },
            },
            options
        );
        return await this.client.update(updateOptions);
    };
    delete = async (customerNumber: number, options?: Prisma.CustomerDeleteArgs): Promise<Customer> => {
        const deleteOptions = merge(
            {
                where: {
                    customerNumber,
                },
            },
            options
        );
        return await this.client.delete(deleteOptions);
    };
}
