import { Employee } from "@prisma/client";

export interface IEmployeeRepository {
    create: (data: any) => Promise<Employee>;
    update: (employeeNumber: number, data: any) => Promise<Employee>;
    delete: (employeeNumber: number) => Promise<Employee>;
    get: (employeeNumber: number) => Promise<Employee | null>;
    getAll: () => Promise<Employee[]>;
}
