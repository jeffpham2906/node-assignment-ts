import { Customer, Employee, User } from "@prisma/client";
export type RequiredConditions = {
    conditions: string[];
    user: Employee & User;
};
export interface ICustomerService {
    onGetCustomers(requiredConditions?: RequiredConditions): Promise<Customer[]>;
    onGetCustomer(id: number, requiredConditions?: RequiredConditions): Promise<Customer>;
    onCreateCustomer(customer: Customer, requiredConditions?: RequiredConditions): Promise<Customer>;
    onUpdateCustomer(
        id: number,
        customer: Partial<Customer>,
        requiredConditions?: RequiredConditions
    ): Promise<Customer>;
    onDeleteCustomer(id: number, requiredConditions?: RequiredConditions): Promise<Customer>;
}
