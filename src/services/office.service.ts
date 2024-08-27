import { Office, Prisma } from "@prisma/client";
import { IOfficeService } from "../interfaces/office/IOfficeService";
import { IOfficeRepository } from "../interfaces/office/IOfficeRepository";

export class OfficeService implements IOfficeService {
    private repository: IOfficeRepository;

    constructor(repository: IOfficeRepository) {
        this.repository = repository;
    }

    async onGetOffice(officeCode: string): Promise<Office | null> {
        return this.repository.get(officeCode);
    }

    async onGetOffices(options?: Prisma.OfficeFindManyArgs): Promise<Office[]> {
        return this.repository.getAll(options);
    }

    onCreateOffice = async (office: Office): Promise<Office> => {
        return this.repository.create(office);
    };

    onUpdateOffice(officeCode: string, office: Partial<Office>): Promise<Office> {
        return this.repository.update(officeCode, office);
    }

    onDeleteOffice(officeCode: string): Promise<Office> {
        return this.repository.delete(officeCode);
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
