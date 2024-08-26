import { Customer, Prisma } from "@prisma/client";

export interface ICustomerRepository {
    create: (data: Prisma.CustomerCreateInput | Customer) => Promise<Customer>;
    update: (customerNumber: number, data: Prisma.CustomerUpdateInput, options?: Prisma.CustomerUpdateArgs) => Promise<Customer>;
    delete: (customerNumber: number, options?: Prisma.CustomerDeleteArgs) => Promise<Customer>;
    get: (customerNumber: number, options?: Prisma.CustomerFindUniqueArgs) => Promise<Customer | null>;
    getAll: (options: Prisma.CustomerFindManyArgs) => Promise<Customer[]>;
}
