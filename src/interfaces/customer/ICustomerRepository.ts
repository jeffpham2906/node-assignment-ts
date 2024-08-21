import { Customer, Prisma } from "@prisma/client";

export interface ICustomerRepository {
    create: (data: Customer) => Promise<Customer>;
    update: (customerNumber: number, data: Partial<Customer>, options?: Prisma.CustomerUpdateArgs) => Promise<Customer>;
    delete: (customerNumber: number, options?: Prisma.CustomerDeleteArgs) => Promise<Customer>;
    get: (customerNumber: number, options?: Prisma.CustomerFindFirstArgs) => Promise<Customer | null>;
    getAll: (options: Prisma.CustomerFindManyArgs) => Promise<Customer[]>;
}
