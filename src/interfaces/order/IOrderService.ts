import { Order, Prisma } from "@prisma/client";

export interface IOrderService {
    onCreate: (
        order: Prisma.OrderCreateInput & { orderDetails: Prisma.OrderDetailCreateManyOrderInput[] }
    ) => Promise<Order>;
    onUpdate: (id: number, order: Prisma.OrderUpdateInput) => Promise<Prisma.OrderUpdateInput>;
    onDelete: (id: number) => Promise<Order>;
    onGet: (id: number) => Promise<Order | null>;
    onGetAll: () => Promise<Order[]>;
}
