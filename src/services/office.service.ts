import { Office } from "@prisma/client";
import { IOfficeService } from "../interfaces/office/IOfficeService";
import { IOfficeRepository } from "../interfaces/office/IOfficeRepository";

export class OfficeService implements IOfficeService {
    private repository: IOfficeRepository;

    constructor(repository: IOfficeRepository) {
        this.repository = repository;
    }

    onGetOffice(officeCode: string): Promise<Office | null> {
        throw new Error("Method not implemented.");
    }

    onGetOffices(): Promise<Office[]> {
        return this.repository.getAll();
    }

    onCreateOffice = async (office: Office): Promise<Office> => {
        return this.repository.create(office);
    };

    onUpdateOffice(officeCode: string, office: Partial<Office>): Promise<Office> {
        throw new Error("Method not implemented.");
    }

    onDeleteOffice(officeCode: string): Promise<Office> {
        throw new Error("Method not implemented.");
    }

    onGetReport = async (officeCode?: string, startDate?: Date, endDate?: Date): Promise<any> => {
        return this.repository.getReport(officeCode, startDate, endDate);
    };
    onGetReportRevenueCustomerByEmployee = async (
        employeeNumber?: number,
        startDate?: Date,
        endDate?: Date
    ): Promise<any> => {
        return this.repository.getReport(undefined, startDate, endDate, employeeNumber);
    };
}
