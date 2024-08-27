import { Customer, Employee, Prisma, User } from "@prisma/client";
import { QueryParams } from "../index";

export type RequiredConditions = {
    conditions: string[];
    user: Employee & User;
};

export interface ICustomerService {
    onGetCustomers(requiredConditions?: RequiredConditions, queryOptions?: Prisma.CustomerFindManyArgs): Promise<Customer[]>;

    onGetCustomer(customerNumber: number, requiredConditions?: RequiredConditions): Promise<Customer>;

    onCreateCustomer(customer: Customer, requiredConditions?: RequiredConditions): Promise<Customer>;

    onUpdateCustomer(
        customerNumber: number,
        customer: Partial<Customer>,
        requiredConditions?: RequiredConditions
    ): Promise<Customer>;

    onDeleteCustomer(customerNumber: number, requiredConditions?: RequiredConditions): Promise<Customer>;
}
