import { OrderStatus, prisma } from "@paperdex/db";
import type { PrismaClient } from "@paperdex/db";
import { OrderWithUserId, OrderWithUserIdANDOrderId } from "../utils/schema.ts/orderSchema";
import { Decimal } from "../../../db/generated/client/runtime/library";
import { AppError } from "@paperdex/lib";
import { createClient, RedisClientType } from "redis";

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

      await this.addOrderToSet({ ...order, orderId: newOrder?.id });
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
          priceDirection: order.priceDirection,
          filledQuantity: order.type === "MARKET" ? order.quantity : 0,
        },
      });
    } catch (error: unknown) {
      console.log("saveOrderToDB", error);
      throw error;
    }
  }
  private async addOrderToSet(order: OrderWithUserIdANDOrderId) {
    const queueOrder = await RedisSet.addToSet(order);
    return queueOrder;
  }
}

export class RedisSet {
  private static client: RedisClientType;

  private constructor() {} // Prevent instantiation

  static async getClient(): Promise<RedisClientType> {
    if (!RedisSet.client) {
      RedisSet.client = createClient({ url: "redis://redis:6379" });
      RedisSet.client.on("error", (err) => console.error("Redis error:", err));
      await RedisSet.client.connect();
      console.log("Redis connected");
    }

    return RedisSet.client;
  }

  static async addToSet(order: OrderWithUserIdANDOrderId) {
    const client = await RedisSet.getClient();
    const key = `orderbook:${order?.symbol}:${order?.side}`;
    const serialized = RedisSet.serializeOrder(order);
    return await client.zAdd(key, {
      score: order?.price ?? 0,
      value: serialized,
    });
  }

  static async getTopOrders(symbol: string, side: string) {
    const client = await RedisSet.getClient();
    const key = `orderbook:${symbol}:${side}`;
    const rawOrders = await client.zRange(key, 0, -1); // Get all orders (low to high price)
    return rawOrders.map((order) => JSON.parse(order) as OrderWithUserIdANDOrderId);
  }

  static async removeOrder(order: OrderWithUserIdANDOrderId) {
    const client = await RedisSet.getClient();
    const key = `orderbook:${order.symbol}:${order.side}`;
    const serialized = RedisSet.serializeOrder(order);

    const remove = await client.zRem(key, serialized);

    return remove;
  }

  private static serializeOrder(order: OrderWithUserIdANDOrderId) {
    return JSON.stringify({
      ...order,
    });
  }
}
