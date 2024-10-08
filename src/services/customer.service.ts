import { Customer, Prisma } from "@prisma/client";
import { ICustomerService, QueryParams, RequiredConditions } from "../interfaces";
import { prisma } from "../lib/prisma";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import { BELONG_TO_THEM, SAME_OFFICE, STATUS_MESSAGES, THEIR_OWN_CUSTOMER } from "../constants";
import { ICustomerRepository } from "../interfaces";
import merge from "lodash.merge";
import { buildQueryParams } from "../utils";

export class CustomerService implements ICustomerService {
    private repository: ICustomerRepository;

    constructor(repository: ICustomerRepository) {
        this.repository = repository;
    }

    onGetCustomers = async (requiredConditions?: RequiredConditions, queryOptions?: Prisma.CustomerFindManyArgs): Promise<Customer[]> => {
        const options = this.checkGet<Prisma.CustomerFindManyArgs>(requiredConditions);
        merge(options, queryOptions);
        return await this.repository.getAll(options);

    };

    onGetCustomer = async (customerNumber: number, requiredConditions?: RequiredConditions): Promise<Customer> => {
        const options = { ...this.checkGet<Prisma.CustomerFindUniqueArgs>(requiredConditions) };
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
        return this.repository.create(customer);

    };

    onUpdateCustomer = async (
        customerNumber: number,
        customer: Partial<Customer>,
        requiredConditions?: RequiredConditions
    ): Promise<Customer> => {
        const options = this.checkUpdateAndDelete<Prisma.CustomerUpdateArgs>(requiredConditions);
        return this.repository.update(customerNumber, customer, options);

    };

    onDeleteCustomer = async (customerNumber: number, requiredConditions?: RequiredConditions): Promise<Customer> => {
        const options = this.checkUpdateAndDelete<Prisma.CustomerDeleteArgs>(requiredConditions);
        return this.repository.delete(customerNumber, options);

    };
    private checkGet = <T>(requiredConditions?: RequiredConditions): T => {
        const options = {} as T;
        if (!requiredConditions) return options;
        const { conditions, user } = requiredConditions;
        conditions.forEach((condition) => {
            switch (condition) {
                case THEIR_OWN_CUSTOMER:
                    merge(options, {
                        where: {
                            salesRepEmployeeNumber: user.employeeNumber
                        }
                    });
                    break;
                case BELONG_TO_THEM:
                    merge(options, {
                        where: {
                            employee: {
                                officeCode: user.officeCode
                            }
                        }
                    });
                    break;
            }
        });
        return options;
    };
    private checkCreate = async (customer: Customer, requiredConditions?: RequiredConditions) => {
        if (!requiredConditions) return;
        const { conditions, user } = requiredConditions;
        return Promise.all(
            conditions.map(async (condition) => {
                switch (condition) {
                    case BELONG_TO_THEM:
                        if (customer.salesRepEmployeeNumber !== user.employeeNumber) {
                            throw new APIError(
                                StatusCodes.UNAUTHORIZED,
                                STATUS_MESSAGES.UNAUTHORIZED,
                                "Staff can only create their own customer, provide a valid employee number"
                            );
                        }
                        break;
                    case SAME_OFFICE:
                        const employee = await prisma.employee.findUnique({
                            where: {
                                employeeNumber: customer.salesRepEmployeeNumber || undefined
                            }
                        });

                        const isSameOffice = employee?.officeCode === user.officeCode;
                        if (!isSameOffice) {
                            throw new APIError(
                                StatusCodes.UNAUTHORIZED,
                                STATUS_MESSAGES.UNAUTHORIZED,
                                "You don't have permission to create | update | delete customer of employee out of your office"
                            );
                        }
                        break;
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
                            officeCode: user.officeCode
                        }
                    }
                });
            }
        });
        return options;
    };
}
