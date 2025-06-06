import { OrderStatus, prisma } from "@paperdex/db";
import type { PrismaClient } from "@paperdex/db";
import { OrderWithUserId, OrderWithUserIdANDOrderId } from "../utils/schema.ts/orderSchema";
import { Decimal } from "../../../db/generated/client/runtime/library";
import { AppError } from "@paperdex/lib";

export class CreateOrder {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async createNewOrder(order: OrderWithUserId) {
    if (order.type === "MARKET") {
      return this.saveOrderToDB(order);
    } else if (order.type === "LIMIT") {
      const newOrder = await this.saveOrderToDB(order);
      if (!newOrder) throw new AppError("Failed to create new order", 500);

      await this.addOrderToQueue({ ...order, orderId: newOrder?.id });
      return newOrder;
    }
  }

  private async saveOrderToDB(order: OrderWithUserId) {
    try {
      const parsedQuantity = new Decimal(order.quantity);
      return this.prisma.order.create({
        data: {
          userId: order.userId,
          symbol: order.symbol,
          side: order.side,
          type: order.type,
          mode: order.mode,
          status: order.type === "MARKET" ? OrderStatus.FILLED : OrderStatus.PENDING,
          quantity: parsedQuantity,
          price: order.type === "LIMIT" ? order.price : null,
          filledQuantity: order.type === "MARKET" ? order.quantity : 0,
        },
      });
    } catch (error: unknown) {
      console.log("saveOrderToDB", error);
      throw error;
    }
  }
  private async addOrderToQueue(order: OrderWithUserIdANDOrderId) {
    console.log("addOrderToQueue==", order);
    return true;
  }
}
