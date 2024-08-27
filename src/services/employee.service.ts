import { Employee, Prisma } from "@prisma/client";
import { APIError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import { STATUS_MESSAGES } from "../constants";
import { IEmployeeRepository, IEmployeeService, QueryParams } from "../interfaces";

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
    onGetEmployees = async (options?: Prisma.EmployeeFindManyArgs): Promise<Employee[]> => {
        return this.repository.getAll(options);
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
    onCreateEmployee = async (
        employee: Prisma.EmployeeCreateInput & { customers: Prisma.CustomerCreateManyEmployeeInput[] }
    ): Promise<Employee> => {
        if (employee.customers && employee.customers.length > 0) {
            const { customers, ...employeeData } = employee;
            return this.repository.createWithCustomers(employeeData, customers);
        } else {
            return this.repository.create(employee);
        }
    };

    onUpdateEmployee = async (employeeNumber: number, employee: Partial<Employee>): Promise<Employee> => {
        this.isChangeRootUser(employeeNumber);
        return this.repository.update(employeeNumber, employee);
    };
    onDeleteEmployee = async (employeeNumber: number): Promise<any> => {
        this.isChangeRootUser(employeeNumber);
        return this.repository.delete(employeeNumber);
    };
}
