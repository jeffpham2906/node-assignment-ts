import { Employee, Prisma, PrismaClient } from "@prisma/client";
import { IEmployeeRepository, QueryParams } from "../interfaces";
import { prisma } from "../lib/prisma";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../constants";
import merge from "lodash.merge";

export class EmployeeRepository implements IEmployeeRepository {
    private client: PrismaClient;

    constructor() {
        this.client = prisma;
    }

    private isChangeDefaultEmployee = (data: any) => {
        if (data?.lastName && data.lastName === "9999") {
            throw new APIError(
                StatusCodes.BAD_REQUEST,
                STATUS_MESSAGES.FAILED,
                "Cannot update | create | delete an default employee of an office"
            );
        }
    };
    getAll = async (options?: Prisma.EmployeeFindManyArgs): Promise<Employee[]> => {
        const defaultOptions = {
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
                customers: true
            }


        } as Prisma.EmployeeFindManyArgs;
        return this.client.employee.findMany(merge(defaultOptions, options));
    };
    getTotalRecordNumber = async (options?: Prisma.EmployeeCountArgs) => {
        return this.client.employee.count(options || {});
    };

    async get(employeeNumber: number): Promise<Employee | null> {
        return this.client.employee.findUnique({
            where: { employeeNumber },
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
                customers: true
            }
        });
    }

    async create(data: Prisma.EmployeeCreateInput): Promise<Employee> {
        return this.client.$transaction(async (trx) => {
            const employeeCreated = await trx.employee.create({ data });
            this.isChangeDefaultEmployee(employeeCreated);
            return employeeCreated;
        });
    }

    async createWithCustomers(
        employee: Prisma.EmployeeCreateInput,
        customers: Prisma.CustomerCreateManyEmployeeInput[]
    ): Promise<Employee> {
        return this.client.$transaction(async (trx) => {
            const employeeCreated = await trx.employee.create({
                data: {
                    ...employee,
                    customers: {
                        createMany: {
                            data: customers
                        }
                    }
                },
                include: {
                    customers: true
                }
            });
            this.isChangeDefaultEmployee(employeeCreated);
            return employeeCreated;
        });
    }

    async update(employeeNumber: number, data: any): Promise<Employee> {
        return this.client.$transaction(async (trx) => {
            const employeeUpdated = await trx.employee.update({
                where: {
                    employeeNumber
                },
                data
            });
            this.isChangeDefaultEmployee(employeeUpdated);
            return employeeUpdated;
        });
    }

    async delete(employeeNumber: number): Promise<any> {
        return this.client.$transaction(async (prisma) => {
            const deletedEmployee = await prisma.employee.delete({
                where: {
                    employeeNumber
                },
                include: {
                    customers: true,
                    office: true
                }
            });
            this.isChangeDefaultEmployee(deletedEmployee);
            if (!Boolean(deletedEmployee.customers.length)) {
                return deletedEmployee;
            }
            const defaultEmployee = await prisma.employee.findFirst({
                where: {
                    officeCode: deletedEmployee.officeCode,
                    AND: {
                        lastName: "9999"
                    }
                }
            });
            if (!defaultEmployee) return;
            return prisma.customer.updateMany({
                where: {
                    salesRepEmployeeNumber: null
                },
                data: {
                    salesRepEmployeeNumber: defaultEmployee?.employeeNumber
                }
            });
        });
    }
}
