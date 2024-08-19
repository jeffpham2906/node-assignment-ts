import { Employee } from "@prisma/client";
import { IEmployeeService } from "../interfaces/IEmployeeService";
import { prisma } from "../lib/prisma";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";

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
    onGetEmployee = async (employeeNumber: number): Promise<Employee> => {
        const employee = await prisma.employee.findFirst({
            where: { employeeNumber },
        });
        if (!employee) {
            throw new APIError(StatusCodes.NOT_FOUND, "NOT_FOUND", `Employee with id ${employeeNumber} not found.`);
        }
        return employee;
    };
    onCreateEmployee = async (employee: Employee): Promise<Employee> => {
        const data = await prisma.employee.create({
            data: employee,
        });
        return data;
    };
    onDeleteEmployee = async (employeeNumber: number): Promise<Employee> => {
        const deletedEmployee = await prisma.employee.delete({
            where: {
                employeeNumber,
            },
        });
        return deletedEmployee;
    };
    onUpdateEmployee = async (employeeNumber: number, employee: Partial<Employee>): Promise<Employee> => {
        const updatedEmployee = await prisma.employee.update({
            where: {
                employeeNumber,
            },
            data: employee,
        });
        return updatedEmployee;
    };
}
