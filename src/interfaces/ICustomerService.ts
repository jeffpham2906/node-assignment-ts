import { Customer } from "@prisma/client";

export interface ICustomerService {
    onGetCustomers(): Promise<Customer[]>;
    onGetCustomer(id: number): Promise<Customer>;
    onCreateCustomer(customer: Customer): Promise<Customer>;
    onUpdateCustomer(id: number, customer: Partial<Customer>): Promise<Customer>;
    onDeleteCustomer(id: number): Promise<Customer>;
}
