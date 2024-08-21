import { Customer, Prisma } from "@prisma/client";
import { ICustomerService, RequiredConditions } from "../interfaces/customer/ICustomerService";
import { prisma } from "../lib/prisma";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import { BELONG_TO_THEM, SAME_OFFICE, STATUS_MESSAGES, THEIR_OWN_CUSTOMER } from "../constants";
import { ICustomerRepository } from "../interfaces";
import merge from "lodash.merge";
export class CustomerService implements ICustomerService {
    private repository: ICustomerRepository;
    constructor(repository: ICustomerRepository) {
        this.repository = repository;
    }

    onGetCustomers = async (requiredConditions?: RequiredConditions): Promise<Customer[]> => {
        const options = this.checkGet<Prisma.CustomerFindManyArgs>(requiredConditions);
        const customers = await this.repository.getAll(options);
        return customers;
    };

    onGetCustomer = async (customerNumber: number, requiredConditions?: RequiredConditions): Promise<Customer> => {
        const options = this.checkGet<Prisma.CustomerFindFirstArgs>(requiredConditions);
        const customer = await this.repository.get(customerNumber, options);

        if (!customer) {
            throw new APIError(
                StatusCodes.NOT_FOUND,
                STATUS_MESSAGES.NOT_FOUND,
                `Customer with id ${customerNumber} not found.`
            );
        }
        return customer;
    };

    onCreateCustomer = async (customer: Customer, requiredConditions?: RequiredConditions): Promise<Customer> => {
        await this.checkCreate(customer, requiredConditions);
        const newCustomer = await this.repository.create(customer);
        return newCustomer;
    };

    onUpdateCustomer = async (
        customerNumber: number,
        customer: Partial<Customer>,
        requiredConditions?: RequiredConditions
    ): Promise<Customer> => {
        const options = this.checkUpdateAndDelete<Prisma.CustomerUpdateArgs>(requiredConditions);
        const updatedCustomer = this.repository.update(customerNumber, customer, options);
        return updatedCustomer;
    };

    onDeleteCustomer = async (customerNumber: number, requiredConditions?: RequiredConditions): Promise<Customer> => {
        const options = this.checkUpdateAndDelete<Prisma.CustomerDeleteArgs>(requiredConditions);
        const deletedCustomer = await this.repository.delete(customerNumber, options);
        return deletedCustomer;
    };
    private checkGet = <T>(requiredConditions?: RequiredConditions): T => {
        const options = {
            include: {
                employee: true,
            },
        } as T;
        if (!requiredConditions) return options;
        const { conditions, user } = requiredConditions;
        conditions.forEach((condition) => {
            if (condition === THEIR_OWN_CUSTOMER) {
                merge(options, {
                    where: {
                        salesRepEmployeeNumber: user.employeeNumber,
                    },
                });
            }
            if (condition === SAME_OFFICE) {
                merge(options, {
                    where: {
                        employee: {
                            officeCode: user.officeCode,
                        },
                    },
                });
            }
        });
        return options;
    };
    private checkCreate = async (customer: Customer, requiredConditions?: RequiredConditions) => {
        if (!requiredConditions) return;
        const { conditions, user } = requiredConditions;
        await Promise.all(
            conditions.map(async (condition) => {
                if (condition === BELONG_TO_THEM && customer.salesRepEmployeeNumber !== user.employeeNumber) {
                    throw new APIError(
                        StatusCodes.UNAUTHORIZED,
                        STATUS_MESSAGES.UNAUTHORIZED,
                        "Staff can only create their own customer, provide a valid employee number"
                    );
                }
                if (condition === SAME_OFFICE) {
                    const employee = await prisma.employee.findFirst({
                        where: {
                            employeeNumber: customer.salesRepEmployeeNumber,
                        },
                    });

                    const isSameOffice = employee?.officeCode === user.officeCode;
                    if (!isSameOffice) {
                        throw new APIError(
                            StatusCodes.UNAUTHORIZED,
                            STATUS_MESSAGES.UNAUTHORIZED,
                            "You don't have permission to create | update | delete customer of employee out of your office"
                        );
                    }
                }
            })
        );
    };
    private checkUpdateAndDelete = <T>(requiredConditions?: RequiredConditions): T => {
        const options = {} as T;
        if (!requiredConditions) return options;
        const { conditions, user } = requiredConditions;
        conditions.forEach((condition) => {
            if (condition === SAME_OFFICE) {
                merge(options, {
                    where: {
                        employee: {
                            officeCode: user.officeCode,
                        },
                    },
                });
            }
        });
        return options;
    };
}
