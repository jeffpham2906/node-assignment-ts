import { IProductRepository } from "../interfaces/product/IProductRepository";
import { IProductService } from "../interfaces/product/IProductService";

export class ProductService implements IProductService {
    private repository: IProductRepository;
    constructor(repository: IProductRepository) {
        this.repository = repository;
    }
    onCreateProduct = async (product: any): Promise<any> => {
        return this.repository.create(product);
    };

    onUpdateProduct = async (productCode: string, product: any): Promise<any> => {
        return this.repository.update(productCode, product);
    };

    onDeleteProduct = async (productCode: string): Promise<any> => {
        return this.repository.delete(productCode);
    };

    onGetProduct = async (productCode: string): Promise<any> => {
        return this.repository.get(productCode);
    };

    onGetProducts = async (): Promise<any> => {
        return this.repository.getAll();
    };
}
