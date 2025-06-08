/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
//  import { OrderWithUserIdANDOrderId } from "../utils/schema.ts/orderSchema";
import { RedisSet } from "./createOrder";
import { getTokenPrice } from "../store/tokenPriceStore";
import { SettleOrders } from "./settleOrder";
import { OrderWithUserIdANDOrderId } from "../utils/schema.ts/orderSchema";

// class MatchEngine {
//   static async matchOrders(symbol: string) {
//     const buyOrders = await RedisSet.getTopOrders(symbol, "BUY");
//     const sellOrders = await RedisSet.getTopOrders(symbol, "SELL");

//     // check for buy order
//     for (const buyOrder of buyOrders) {
//       const { symbol, price, priceDirection } = buyOrder;

//       const tokenName = symbol?.split("/")[0];
//       const latestTokenPrice = getTokenPrice([tokenName!]);

//       const tokenPriceObj = latestTokenPrice[0];
//       if (!tokenPriceObj || tokenPriceObj?.price === undefined || price === undefined || price === null) return;

//       console.log("buy order ---------------", buyOrder);
//       console.log(" buy tokenPriceObj ---------------", tokenPriceObj.price);

//       if (priceDirection === "UP" ? tokenPriceObj?.price >= price : tokenPriceObj?.price <= price) {
//         console.log(" buy order Settled====================================>");
//         const settleOrder = new SettleOrders();

//         await settleOrder.settleSpotOrder(buyOrder);
//         await RedisSet.removeOrder(buyOrder);
//       }
//     }

//     // check for sell order
//     for (const sellOrder of sellOrders) {
//       const { symbol, price, priceDirection } = sellOrder;

//       const tokenName = symbol?.split("/")[0];
//       const latestTokenPrice = getTokenPrice([tokenName!]);

//       const tokenPriceObj = latestTokenPrice[0];
//       if (!tokenPriceObj || tokenPriceObj?.price === undefined || price === undefined || price === null) return;

//       if (priceDirection === "UP" ? tokenPriceObj?.price >= price : tokenPriceObj?.price <= price) {
//         console.log("sell order Settled==============================>");
//         const settleOrder = new SettleOrders();
//         await settleOrder.settleSpotOrder(sellOrder);
//         await RedisSet.removeOrder(sellOrder);
//       }
//     }
//   }
// }

// export async function runMatcher() {
//   const tradingPairs = [
//     "USDT/DAI",
//     "ETH/USDT",
//     "BTC/USDT",
//     "BNB/USDT",
//     "SOL/USDT",
//     "ADA/USDT",
//     "XRP/USDT",
//     "DOT/USDT",
//     "LINK/USDT",
//     "AVAX/USDT",
//     "TRX/USDT",
//     "MATIC/USDT",
//     "LTC/USDT",
//     "SHIB/USDT",
//     "UNI/USDT",
//     "ATOM/USDT",
//     "XMR/USDT",
//     "NEAR/USDT",
//     "APT/USDT",
//     "PEPE/USDT",
//   ];

//   while (true) {
//     for (const pair of tradingPairs) {
//       try {
//         await MatchEngine.matchOrders(pair);
//       } catch (error) {
//         console.error(`Error matching orders for ${pair}:`, error);
//         // Optionally: send to error monitoring/logging
//       }
//     }

//     await new Promise((res) => setTimeout(res, 8000)); // wait before next round
//   }
// }

class MatchEngine {
  static async matchOrders(symbol: string) {
    console.log();

    const [buyOrders, sellOrders] = await Promise.all([
      RedisSet.getTopOrders(symbol, "BUY"),
      RedisSet.getTopOrders(symbol, "SELL"),
    ]);

    const tokenName = symbol.split("/")[0]!;
    const tokenPriceObj = getTokenPrice([tokenName])[0];

    if (!tokenPriceObj || tokenPriceObj.price === undefined) return;

    const currentPrice = tokenPriceObj.price;

    console.log("buyOrders--------------------", symbol, ":", buyOrders, currentPrice);
    console.log("sellOrders--------------------", symbol, ":", sellOrders, currentPrice);

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
