import { Customer, Employee, Prisma, PrismaClient } from "@prisma/client";
import { IEmployeeRepository } from "../interfaces";
import { prisma } from "../lib/prisma";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../constants";

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
    getAll = async (): Promise<Employee[]> => {
        return this.client.employee.findMany({
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
                customers: true
            }
        });
    };

    async get(employeeNumber: number): Promise<Employee | null> {
        return this.client.employee.findUnique({
            where: { employeeNumber },
            include: {
                user: true,
                customers: true
            }
        });
    }

    async create(data: Prisma.EmployeeCreateInput): Promise<Employee> {
        this.isChangeDefaultEmployee(data);
        return this.client.employee.create({
            data
        });
    }

    async createWithCustomers(
        employee: Prisma.EmployeeCreateInput,
        customers: Prisma.CustomerCreateManyEmployeeInput[]
    ): Promise<Employee> {
        this.isChangeDefaultEmployee(employee);
        return this.client.employee.create({
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
    }

    async update(employeeNumber: number, data: any): Promise<Employee> {
        this.isChangeDefaultEmployee(data);
        return this.client.employee.update({
            where: {
                employeeNumber
            },
            data
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
