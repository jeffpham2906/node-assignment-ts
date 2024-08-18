import { Employee } from "@prisma/client";
import { IEmployeeService } from "../interfaces/IEmployeeService";
import { prisma } from "../lib/prisma";

export class EmployeeService implements IEmployeeService {
    onGetEmployees = async (): Promise<Employee[]> => {
        const data = await prisma.employee.findMany({
            include: {
                employeeRole: true,
                User: true,
                Customer: true,
            },
        });
        return data;
    };
    onGetEmployee = async (id: number): Promise<Employee> => {
        const employee = await prisma.employee.findFirst({
            where: { employeeNumber: id },
        });
        if (!employee) {
            throw new Error(`Employee with id ${id} not found.`);
        }
        return employee;
    };
    onCreateEmployee = async (employee: Employee): Promise<Employee> => {
        const data = await prisma.employee.create({
            data: employee,
        });
        return data;
    };
    onDeleteEmployee = async (id: number): Promise<Employee> => {
        const deletedEmployee = await prisma.employee.delete({
            where: {
                employeeNumber: id,
            },
        });
        return deletedEmployee;
    };
    onUpdateEmployee = async (id: number, employee: Partial<Employee>): Promise<Employee> => {
        const updatedEmployee = await prisma.employee.update({
            where: {
                employeeNumber: id,
            },
            data: employee,
        });
        return updatedEmployee;
    };
}
