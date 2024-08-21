import { Employee } from "@prisma/client";
// type GetParams = {
//     page: number;
//     limit: number;
//     search?: string;
//     sort?: Record<string, "asc" | "desc">;
//     filter?: Record<string, string>;
// };
export interface IEmployeeService {
    onGetEmployees(): Promise<Employee[]>;
    onGetEmployee(id: number): Promise<Employee>;
    onCreateEmployee(employee: Employee): Promise<Employee>;
    onUpdateEmployee(id: number, employee: Partial<Employee>): Promise<Employee>;
    onDeleteEmployee(id: number): Promise<Employee>;
}
