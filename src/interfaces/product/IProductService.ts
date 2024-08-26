import { Product } from "@prisma/client";

export interface IProductService {
    onGetProduct(productCode: string): Promise<Product>;
    onGetProducts(): Promise<Product[]>;
    onCreateProduct(product: any): Promise<Product>;
    onUpdateProduct(productCode: string, product: any): Promise<Product>;
    onDeleteProduct(productCode: string): Promise<Product>;
}
