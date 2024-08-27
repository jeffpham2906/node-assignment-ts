import { Prisma, Product } from "@prisma/client";

export interface IProductRepository {
    create: (data: Prisma.ProductCreateInput) => Promise<Product>;
    update: (productCode: string, data: Prisma.ProductUpdateInput) => Promise<Product>;
    delete: (productCode: string) => Promise<any>;
    get: (productCode: string) => Promise<Product | null>;
    getAll: (options?: Prisma.ProductFindManyArgs) => Promise<Product[]>;
}
