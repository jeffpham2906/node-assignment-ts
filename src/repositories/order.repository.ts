import { Order, Prisma, PrismaClient } from "@prisma/client";
import { IOrderRepository } from "../interfaces/order/IOrderRepository";
import { prisma } from "../lib/prisma";

export class OrderRepository implements IOrderRepository {
    private client: PrismaClient;

    constructor() {
        this.client = prisma;
    }

    get = async (orderNumber: number): Promise<Order | null> => {
        return this.client.order.findUnique({
            where: {
                orderNumber
            }
        });
    };

    getAll = async (): Promise<Order[]> => {
        return this.client.order.findMany({
            include: {
                orderDetails: {
                    select: {
                        productCode: true,
                        quantityOrdered: true,
                        priceEach: true,
                        orderLineNumber: true
                    }
                }
            }
        });
    };

    create = async (
        order: Prisma.OrderCreateInput,
        orderDetails: Prisma.OrderDetailCreateManyOrderInput[]
    ): Promise<any> => {
        return this.client.$transaction(async (prisma) => {
            // Let backend handle price calculation 
            const orderDetailWithPrice = await Promise.all(
                orderDetails.map(async (orderDetail) => {
                    const product = await prisma.product.findUnique({
                        where: { productCode: orderDetail.productCode }
                    });
                    if (!product) {
                        throw new Error(`Product not found: ${orderDetail.productCode}`);
                    }
                    return {
                        ...orderDetail,
                        priceEach: product.buyPrice
                    };
                })
            );
            return prisma.order.create({
                data: { ...order, orderDetails: { createMany: { data: orderDetailWithPrice } } }
            });
        });
    };

    update = async (orderNumber: number, order: Prisma.OrderUpdateInput): Promise<Order> => {
        return this.client.order.update({
            where: {
                orderNumber
            },
            data: {
                ...order
            }
        });
    };

    delete = async (orderNumber: number): Promise<Order> => {
        return this.client.order.delete({
            where: {
                orderNumber
            }
        });
    };
}
