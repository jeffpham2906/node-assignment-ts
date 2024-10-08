import { Office, Prisma } from "@prisma/client";

export interface IOfficeRepository {
    getAll: (options?: Prisma.OfficeFindManyArgs) => Promise<Office[]>;
    get: (officeCode: string) => Promise<Office | null>;
    create: (office: Prisma.OfficeCreateInput) => Promise<Office>;
    update: (officeCode: string, office: Prisma.OfficeUpdateInput) => Promise<Office>;
    delete: (officeCode: string) => Promise<Office>;
    getReport: (officeCode?: string, startDate?: Date, endDate?: Date, employeeNumber?: number) => Promise<any>;
}
