import { Customer, Prisma } from "@prisma/client";
import { ICustomerService, RequiredConditions } from "../interfaces/ICustomerService";
import { prisma } from "../lib/prisma";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
const checkRead = (requiredConditions: RequiredConditions): Prisma.CustomerFindManyArgs => {
    let options = {
        include: {
            employee: true,
        },
    } as Prisma.CustomerFindManyArgs;
    const { conditions, user } = requiredConditions;
    conditions.forEach((condition) => {
        if (condition === "theirOwnCustomer") {
            options = {
                ...options,
                where: {
                    salesRepEmployeeNumber: user.employeeNumber,
                },
            };
        }
        if (condition === "sameOffice") {
            options = {
                ...options,
                where: {
                    employee: {
                        officeCode: user.officeCode,
                    },
                },
            };
        }
    });
    return options;
};
const checkCreate = async (customer: Customer, requiredConditions?: RequiredConditions) => {
    if (requiredConditions) {
        const { conditions, user } = requiredConditions;
        await Promise.all(
            conditions.map(async (condition) => {
                if (condition === "belongToThem" && customer.salesRepEmployeeNumber !== user.employeeNumber) {
                    throw new APIError(
                        "UNAUTHORIZED",
                        StatusCodes.UNAUTHORIZED,
                        "Staff can only create their own customer, provide a valid employee number"
                    );
                }
                if (condition === "sameOffice") {
                    const employee = await prisma.employee.findFirst({
                        where: {
                            employeeNumber: customer.salesRepEmployeeNumber,
                        },
                    });

                    const isSameOffice = employee?.officeCode === user.officeCode;
                    if (!isSameOffice) {
                        throw new APIError(
                            "UNAUTHORIZED",
                            StatusCodes.UNAUTHORIZED,
                            "You don't have permission to create | update | delete customer of employee out of your office"
                        );
                    }
                }
            })
        );
    }
};
const filterOptions = (customerNumber: number, requiredConditions?: RequiredConditions) => {
    let defaultOptions = {
        include: {
            employee: true,
        },
        where: { customerNumber },
    } as Prisma.CustomerDeleteArgs;
    if (requiredConditions) {
        const { conditions, user } = requiredConditions;
        conditions.forEach((condition) => {
            if (condition === "sameOffice") {
                defaultOptions = {
                    ...defaultOptions,
                    where: {
                        ...defaultOptions.where,
                        employee: {
                            officeCode: user.officeCode,
                        },
                    },
                };
            }
        });
    }
    return defaultOptions;
};
export class CustomerService implements ICustomerService {
    onGetCustomers = async (requiredConditions?: RequiredConditions): Promise<Customer[]> => {
        let defaultOptions = {} as Prisma.CustomerFindManyArgs;
        if (requiredConditions) {
            defaultOptions = { ...defaultOptions, ...checkRead(requiredConditions) };
        }
        const customers = await prisma.customer.findMany(defaultOptions);
        return customers;
    };

    onGetCustomer = async (customerNumber: number, requiredConditions?: RequiredConditions): Promise<Customer> => {
        let defaultOptions = {
            where: { customerNumber },
        } as Prisma.CustomerFindManyArgs;
        if (requiredConditions) {
            defaultOptions = { ...defaultOptions, ...checkRead(requiredConditions) };
        }
        const customer = await prisma.customer.findFirst(defaultOptions);
        if (!customer) {
            throw new APIError("NOT_FOUND", StatusCodes.NOT_FOUND, `Customer with id ${customerNumber} not found.`);
        }
        return customer;
    };

    onCreateCustomer = async (customer: Customer, requiredConditions?: RequiredConditions): Promise<Customer> => {
        await checkCreate(customer, requiredConditions);
        const newCustomer = await prisma.customer.create({
            data: customer,
        });
        return newCustomer;
    };

    onUpdateCustomer = async (
        customerNumber: number,
        customer: Partial<Customer>,
        requiredConditions?: RequiredConditions
    ): Promise<Customer> => {
        const options = filterOptions(customerNumber, requiredConditions);
        const updatedCustomer = await prisma.customer.update({ ...options, data: customer });
        return updatedCustomer;
    };

    onDeleteCustomer = async (customerNumber: number, requiredConditions?: RequiredConditions): Promise<Customer> => {
        const options = filterOptions(customerNumber, requiredConditions);
        const deletedCustomer = await prisma.customer.delete({ ...options });
        return deletedCustomer;
    };
}
