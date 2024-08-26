import { Employee, Prisma } from "@prisma/client";

export interface IEmployeeRepository {
    create: (data: Prisma.EmployeeCreateInput) => Promise<Employee>;
    createWithCustomers: (
        employee: Prisma.EmployeeCreateInput,
        customers: Prisma.CustomerCreateManyEmployeeInput[]
    ) => Promise<Employee>;
    update: (employeeNumber: number, data: Partial<Employee>) => Promise<Employee>;
    delete: (employeeNumber: number) => Promise<any>;
    get: (employeeNumber: number) => Promise<Employee | null>;
    getAll: () => Promise<Employee[]>;
}
