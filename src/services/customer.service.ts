import { Customer } from "@prisma/client";
import { ICustomerService } from "../interfaces/ICustomerService";
import { prisma } from "../lib/prisma";

export class CustomerService implements ICustomerService {
    onGetCustomers = async (): Promise<Customer[]> => {
        const customers = await prisma.customer.findMany({
            include: {
                employee: true,
            },
        });
        return customers;
    };
    onGetCustomer = async (id: number): Promise<Customer> => {
        const customer = await prisma.customer.findFirst({
            where: { customerNumber: id },
            include: {
                employee: true,
            },
        });
        if (!customer) {
            throw new Error(`Customer with id ${id} not found.`);
        }
        return customer;
    };
    onCreateCustomer = async (customer: Customer): Promise<Customer> => {
        const newCustomer = await prisma.customer.create({
            data: customer,
        });
        return newCustomer;
    };
    onDeleteCustomer = async (id: number): Promise<Customer> => {
        const deletedCustomer = await prisma.customer.delete({
            where: { customerNumber: id },
        });
        return deletedCustomer;
    };
    onUpdateCustomer = async (id: number, customer: Partial<Customer>): Promise<Customer> => {
        const updatedCustomer = await prisma.customer.update({
            where: { customerNumber: id },
            data: customer,
        });
        return updatedCustomer;
    };
}
