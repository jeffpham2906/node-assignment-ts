import { IProductRepository } from "../interfaces/product/IProductRepository";
import { IProductService } from "../interfaces/product/IProductService";
import { Prisma, Product } from "@prisma/client";

export class ProductService implements IProductService {
    private repository: IProductRepository;

    constructor(repository: IProductRepository) {
        this.repository = repository;
    }

    onCreateProduct = async (product: Prisma.ProductCreateInput): Promise<Product> => {
        return this.repository.create(product);
    };

    onUpdateProduct = async (productCode: string, product: Prisma.ProductUpdateInput): Promise<Product> => {
        return this.repository.update(productCode, product);
    };

    onDeleteProduct = async (productCode: string): Promise<Product> => {
        return this.repository.delete(productCode);
    };

    onGetProduct = async (productCode: string): Promise<Product | null> => {
        return this.repository.get(productCode);
    };

    onGetProducts = async (options?: Prisma.ProductFindManyArgs): Promise<Product[]> => {
        return this.repository.getAll(options);
    };
}
