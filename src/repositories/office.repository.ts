import { Office, Prisma, PrismaClient } from "@prisma/client";
import { IOfficeRepository } from "../interfaces/office/IOfficeRepository";
import { prisma } from "../lib/prisma";

export class OfficeRepository implements IOfficeRepository {
    private client: PrismaClient;

    constructor() {
        this.client = prisma;
    }

    create = async (office: Prisma.OfficeCreateInput): Promise<Office> => {
        return this.client.office.create({
            data: {
                ...office,
                employees: {
                    create: {
                        lastName: "9999",
                        firstName: "Default",
                        extension: "",
                        email: "Default",
                        reportsTo: null,
                        jobTitle: "Default"
                    }
                }
            }
        });
    };


    delete = async (officeCode: string): Promise<Office> => {
        return this.client.office.delete({
            where: {
                officeCode
            }
        });
    };


    getAll = async (): Promise<Office[]> => {
        return this.client.office.findMany();
    };


    get = async (officeCode: string): Promise<Office | null> => {
        return this.client.office.findUnique({
            where: {
                officeCode
            }
        });
    };


    update = async (officeCode: string, office: Prisma.OfficeUpdateInput): Promise<Office> => {
        return this.client.office.update({
            where: {
                officeCode
            },
            data: {
                ...office
            }
        });
    };


    getReport = async (
        officeCode?: string,
        startDate?: Date,
        endDate?: Date,
        employeeNumber?: number
    ): Promise<any> => {
        const salesInfo = await prisma.order.findMany({
            where: {
                orderDate: {
                    gte: startDate?.toISOString(),
                    lte: endDate?.toISOString()
                },
                customer: {
                    employee: {
                        officeCode: officeCode ? officeCode : undefined, // Filter by office code if provided
                        employeeNumber: employeeNumber ? employeeNumber : undefined
                    }
                }
            },
            include: {
                orderDetails: {
                    include: {
                        Product: true
                    }
                }
            }
        });

        return salesInfo.reduce(
            (acc, order) => {
                const { orderDetails } = order;
                orderDetails.forEach((detail) => {
                    const revenue = parseFloat(detail.priceEach + "") * detail.quantityOrdered;
                    acc.totalRevenue += revenue;
                    if (!acc.productLineRevenue[detail.Product.productLine]) {
                        acc.productLineRevenue[detail.Product.productLine] = 0;
                    }
                    acc.productLineRevenue[detail.Product.productLine] += revenue;
                });
                return acc;
            },
            {
                officeCode: officeCode ? officeCode : undefined,
                employeeNumber: employeeNumber ? employeeNumber : undefined,
                totalRevenue: 0,
                productLineRevenue: {} as Record<string, number>,
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString()
            }
        );
    };
}
