import { Prisma, Product } from "@prisma/client";

export interface IProductService {
    onGetProduct(productCode: string): Promise<Product | null>;

    onGetProducts(options?: Prisma.ProductFindManyArgs): Promise<Product[]>;

    onCreateProduct(product: Prisma.ProductCreateInput): Promise<Product>;

    onUpdateProduct(productCode: string, product: Prisma.ProductUpdateInput): Promise<Product>;

    onDeleteProduct(productCode: string): Promise<Product>;
}
