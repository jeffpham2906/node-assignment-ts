import { Employee, Prisma } from "@prisma/client";
import { QueryParams } from "../index";

export interface IEmployeeRepository {
    create: (data: Prisma.EmployeeCreateInput) => Promise<Employee>;
    createWithCustomers: (
        employee: Prisma.EmployeeCreateInput,
        customers: Prisma.CustomerCreateManyEmployeeInput[]
    ) => Promise<Employee>;
    update: (employeeNumber: number, data: Partial<Employee>) => Promise<Employee>;
    delete: (employeeNumber: number) => Promise<any>;
    get: (employeeNumber: number) => Promise<Employee | null>;
    getAll: (options?: Prisma.EmployeeFindManyArgs) => Promise<Employee[]>;
    getTotalRecordNumber: (options?: Prisma.EmployeeCountArgs) => Promise<number>;
}
