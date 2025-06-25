/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
//  import { OrderWithUserIdANDOrderId } from "../utils/schema.ts/orderSchema";
import { RedisSet } from "./createOrder";
import { getTokenPrice } from "../store/tokenPriceStore";
import { SettleOrders } from "./settleOrder";
import { OrderWithUserIdANDOrderId } from "../utils/schema.ts/orderSchema";

class MatchEngine {
  static async matchOrders(symbol: string) {
    const [buyOrders, sellOrders] = await Promise.all([
      RedisSet.getTopOrders(symbol, "BUY"),
      RedisSet.getTopOrders(symbol, "SELL"),
    ]);

    const tokenName = symbol.split("/")[0]!;
    const tokenPriceObj = getTokenPrice([tokenName])[0];

    if (!tokenPriceObj || tokenPriceObj.price === undefined) return;

    const currentPrice = tokenPriceObj.price;

    await Promise.all([
      this.processOrders(buyOrders, currentPrice, "BUY"),
      this.processOrders(sellOrders, currentPrice, "SELL"),
    ]);
  }

  private static async processOrders(orders: OrderWithUserIdANDOrderId[], currentPrice: number, side: "BUY" | "SELL") {
    for (const order of orders) {
      if (order.price === undefined || order.price === null) continue;

      const shouldSettle = order.priceDirection === "UP" ? currentPrice >= order.price : currentPrice <= order.price;

      if (shouldSettle) {
        console.log(`${side} order settled for:`, order);
        const settleOrder = new SettleOrders();
        await settleOrder.settleSpotOrder(order);
        await RedisSet.removeOrder(order);
      }
    }
  }
}

export async function runMatcher() {
  const tradingPairs = [
    "USDT/DAI",
    "ETH/USDT",
    "BTC/USDT",
    "BNB/USDT",
    "SOL/USDT",
    "ADA/USDT",
    "XRP/USDT",
    "DOT/USDT",
    "LINK/USDT",
    "AVAX/USDT",
    "TRX/USDT",
    "MATIC/USDT",
    "LTC/USDT",
    "SHIB/USDT",
    "UNI/USDT",
    "ATOM/USDT",
    "XMR/USDT",
    "NEAR/USDT",
    "APT/USDT",
    "PEPE/USDT",
  ];

  while (true) {
    await Promise.all(
      tradingPairs.map(async (pair) => {
        try {
          await MatchEngine.matchOrders(pair);
        } catch (err) {
          console.error(`Failed matching ${pair}:`, err);
        }
      }),
    );

    await new Promise((res) => setTimeout(res, 8000));
  }
}
