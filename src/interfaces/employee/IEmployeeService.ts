import { Employee, Prisma } from "@prisma/client";

export interface IEmployeeService {
    onGetEmployees(query?: Prisma.EmployeeFindManyArgs): Promise<Employee[]>;

    onGetEmployee(id: number): Promise<Employee>;

    onCreateEmployee(
        employee: Prisma.EmployeeCreateInput,
        customers?: Prisma.CustomerCreateManyEmployeeInput[]
    ): Promise<Employee>;

    onUpdateEmployee(id: number, employee: Partial<Employee>): Promise<Employee>;

    onDeleteEmployee(id: number): Promise<any>;
}
