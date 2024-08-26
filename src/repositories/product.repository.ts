import { PrismaClient } from "@prisma/client";
import { IProductRepository } from "../interfaces/product/IProductRepository";
import { prisma } from "../lib/prisma";

export class ProductRepository implements IProductRepository {
    private client: PrismaClient;
    constructor() {
        this.client = prisma;
    }

    get = async (productCode: string): Promise<any> => {
        return this.client.product.findUnique({
            where: {
                productCode,
            },
        });
    };

    getAll = async (): Promise<any> => {
        return this.client.product.findMany();
    };

    create = async (data: any): Promise<any> => {
        return this.client.product.create({
            data,
        });
    };

    update = async (productCode: string, data: any): Promise<any> => {
        return this.client.product.update({
            where: {
                productCode,
            },
            data,
        });
    };

    delete = async (productCode: string): Promise<any> => {
        return this.client.product.delete({
            where: {
                productCode,
            },
        });
    };
}
