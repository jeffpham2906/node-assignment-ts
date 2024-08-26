import { Order, Prisma } from "@prisma/client";

export interface IOrderRepository {
    get: (orderNumber: number) => Promise<Order | null>;
    getAll: () => Promise<Order[]>;
    create: (order: Prisma.OrderCreateInput, orderDetails: Prisma.OrderDetailCreateManyOrderInput[]) => Promise<Order>;
    update: (orderNumber: number, order: Prisma.OrderUpdateInput) => Promise<Order>;
    delete: (orderNumber: number) => Promise<Order>;
}
