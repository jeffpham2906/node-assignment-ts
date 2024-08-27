import { Office, Prisma } from "@prisma/client";

export interface IOfficeService {
    onGetOffices(options?: Prisma.OfficeFindManyArgs): Promise<Office[]>;

    onGetOffice(officeCode: string): Promise<Office | null>;

    onCreateOffice(office: Office): Promise<Office>;

    onUpdateOffice(officeCode: string, office: Partial<Office>): Promise<Office>;

    onDeleteOffice(officeCode: string): Promise<Office>;

    onGetReport(officeCode?: string, startDate?: Date, endDate?: Date): Promise<any>;

    onGetReportRevenueCustomerByEmployee(employeeNumber: number, startDate?: Date, endDate?: Date): Promise<any>;
}
