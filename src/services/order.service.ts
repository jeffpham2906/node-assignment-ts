import { Order, Prisma } from "@prisma/client";
import { IOrderRepository } from "../interfaces/order/IOrderRepository";
import { IOrderService } from "../interfaces/order/IOrderService";

export class OrderService implements IOrderService {
    private repository: IOrderRepository;

    constructor(repository: IOrderRepository) {
        this.repository = repository;
    }

    onCreate = async (
        order: Prisma.OrderCreateInput & { orderDetails: Prisma.OrderDetailCreateManyOrderInput[] }
    ): Promise<Order> => {
        const { orderDetails, ...orderData } = order;
        return this.repository.create(orderData, orderDetails);
    };

    onUpdate = async (id: number, order: Prisma.OrderUpdateInput): Promise<Prisma.OrderUpdateInput> => {
        return this.repository.update(id, order);
    };

    onDelete = async (id: number): Promise<Order> => {
        return this.repository.delete(id);
    };

    onGet = async (id: number): Promise<Order | null> => {
        return this.repository.get(id);
    };

    onGetAll = async (options?: Prisma.OrderFindManyArgs): Promise<Order[]> => {
        return this.repository.getAll(options);
    };
}
