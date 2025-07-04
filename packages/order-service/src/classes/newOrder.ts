import { AppError } from "@paperdex/lib";
import { OrderSchemaType } from "../utils/schema.ts/orderSchema";
import { SettleOrders } from "./settleOrder";
import { CreateOrder } from "./createOrder";
import type { Order } from "@paperdex/db";

export class NewOrder {
  private settleOrder;
  private createOrder;

  constructor() {
    this.settleOrder = new SettleOrders();
    this.createOrder = new CreateOrder();
  }

  async createNewOrder(orderData: OrderSchemaType, userId: string): Promise<Order | string> {
    if (orderData.side === "BUY") await this.settleOrder.checkActualBalances({ ...orderData, userId });

    if (orderData.type === "MARKET") return this.createMarketOrder(orderData, userId);
    if (orderData.type === "LIMIT") return this.createLimitOrder(orderData, userId);
    throw new AppError(`Unsupported order type: ${orderData.type}`, 404);
  }

  private async createMarketOrder(orderData: OrderSchemaType, userId: string): Promise<Order | string> {
    const newOrder = await this.createOrder.createNewOrder({ ...orderData, userId });
    if (!newOrder) throw new AppError("Failed to create new order", 500);
    return await this.settleOrder.settleSpotOrder({ ...orderData, userId, orderId: newOrder.id });
  }

  private async createLimitOrder(orderData: OrderSchemaType, userId: string) {
    const newOrder = await this.createOrder.createNewOrder({ ...orderData, userId });
    if (!newOrder) throw new AppError("Failed to create new order", 500);

    return newOrder;
  }
}
