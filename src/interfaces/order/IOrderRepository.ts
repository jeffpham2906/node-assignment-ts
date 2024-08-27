import { Order, Prisma } from "@prisma/client";

export interface IOrderRepository {
    get: (orderNumber: number) => Promise<Order | null>;
    getAll: (options?: Prisma.OrderFindManyArgs) => Promise<Order[]>;
    create: (order: Prisma.OrderCreateInput, orderDetails: Prisma.OrderDetailCreateManyOrderInput[]) => Promise<Order>;
    update: (orderNumber: number, order: Prisma.OrderUpdateInput) => Promise<Order>;
    delete: (orderNumber: number) => Promise<Order>;
}
