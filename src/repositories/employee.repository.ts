import { Employee, Prisma } from "@prisma/client";
import { IEmployeeRepository } from "../interfaces";
import { prisma } from "../lib/prisma";

export class EmployeeRepository implements IEmployeeRepository {
    private client: Prisma.EmployeeDelegate;
    constructor() {
        this.client = prisma.employee;
    }
    getAll = async (): Promise<Employee[]> => {
        const data = await prisma.employee.findMany({
            include: {
                employeeRole: true,
                User: {
                    select: {
                        username: true,
                    },
                },
                Customer: true,
            },
        });
        return data;
    };
    async get(employeeNumber: number): Promise<Employee | null> {
        const data = await this.client.findFirst({
            where: { employeeNumber },
        });
        return data;
    }
    async create(data: any): Promise<Employee> {
        return await this.client.create({
            data,
        });
    }
    async update(employeeNumber: number, data: any): Promise<Employee> {
        return await this.client.update({
            where: {
                employeeNumber,
            },
            data,
        });
    }
    async delete(employeeNumber: number): Promise<Employee> {
        return await this.client.delete({
            where: {
                employeeNumber,
            },
        });
    }
}
