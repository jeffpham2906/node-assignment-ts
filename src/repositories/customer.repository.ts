import { Customer, Prisma, PrismaClient } from "@prisma/client";
import { ICustomerRepository } from "../interfaces";
import { prisma } from "../lib/prisma";
import merge from "lodash.merge";

export class CustomerRepository implements ICustomerRepository {
    private client: PrismaClient;

    constructor() {
        this.client = prisma;
    }

    get = async (customerNumber: number, options: Prisma.CustomerFindUniqueArgs = {}): Promise<Customer | null> => {
        const getOptions = merge({ where: { customerNumber } }, options);
        return this.client.customer.findFirst(getOptions);
    };
    getAll = async (options: Prisma.CustomerFindManyArgs): Promise<Customer[]> => {
        return this.client.customer.findMany(options);
    };
    create = async (data: Prisma.CustomerCreateInput | Customer): Promise<Customer> => {
        return this.client.customer.create({ data });
    };
    update = async (
        customerNumber: number,
        data: Prisma.CustomerUpdateInput,
        options?: Prisma.CustomerUpdateArgs
    ): Promise<Customer> => {
        const updateOptions = merge(
            {
                where: {
                    customerNumber
                },
                data,
                include: {
                    employee: true
                }
            },
            options
        );
        return this.client.customer.update(updateOptions);
    };
    delete = async (customerNumber: number, options?: Prisma.CustomerDeleteArgs): Promise<Customer> => {
        const deleteOptions = merge(
            {
                where: {
                    customerNumber
                }
            },
            options
        );
        return this.client.customer.delete(deleteOptions);
    };
}
