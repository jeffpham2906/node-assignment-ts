import { Employee } from "@prisma/client";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../constants";
import { IEmployeeRepository, IEmployeeService } from "../interfaces";

export class EmployeeService implements IEmployeeService {
    private repository: IEmployeeRepository;
    constructor(repository: IEmployeeRepository) {
        this.repository = repository;
    }
    private isChangeRootUser = (employeeNumber: number) => {
        const error = new APIError(
            StatusCodes.FORBIDDEN,
            STATUS_MESSAGES.ACCESS_DENIED,
            "Cannot change employee with id 1 (Root User)"
        );
        const rootUserIds = [1];
        if (rootUserIds.includes(employeeNumber)) {
            throw error;
        }
    };
    onGetEmployees = async (): Promise<Employee[]> => {
        const data = await this.repository.getAll();
        return data;
    };
    onGetEmployee = async (employeeNumber: number): Promise<Employee> => {
        const employee = await this.repository.get(employeeNumber);
        if (!employee) {
            throw new APIError(
                StatusCodes.NOT_FOUND,
                STATUS_MESSAGES.NOT_FOUND,
                `Employee with id ${employeeNumber} not found.`
            );
        }
        return employee;
    };
    onCreateEmployee = async (employee: Employee): Promise<Employee> => {
        const data = await this.repository.create(employee);
        return data;
    };

    onUpdateEmployee = async (employeeNumber: number, employee: Partial<Employee>): Promise<Employee> => {
        this.isChangeRootUser(employeeNumber);
        const updatedEmployee = await this.repository.update(employeeNumber, employee);
        return updatedEmployee;
    };
    onDeleteEmployee = async (employeeNumber: number): Promise<Employee> => {
        this.isChangeRootUser(employeeNumber);
        const deletedEmployee = await this.repository.delete(employeeNumber);
        return deletedEmployee;
    };
}
