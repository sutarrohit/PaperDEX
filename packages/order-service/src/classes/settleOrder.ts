import { OrderSide, OrderStatus, prisma } from "@paperdex/db";
import type { Prisma, PrismaClient } from "@paperdex/db";
import { Decimal } from "../../../db/generated/client/runtime/library";
import { getUserDetails } from "../services/userService";
import { AppError } from "@paperdex/lib";
import { v4 as uuidv4 } from "uuid";
import { calculateTradeEffects } from "../services/tradeService";
import { insufficientBalanceError, tokenInfo } from "@paperdex/lib";
import { OrderWithUserIdANDOrderId } from "../utils/schema.ts/orderSchema";

export class SettleOrders {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  async settleSpotOrder(order: OrderWithUserIdANDOrderId) {
    const [baseToken, quoteToken] = order.symbol.split("/");
    if (!baseToken || !quoteToken) throw new AppError("Invalid symbol format. Expected format: BASE/QUOTE", 400);

    const user = await getUserDetails(order.userId);
    const walletId = user.wallet.id;
    const parsedQuantity = new Decimal(order.quantity);

    const { baseTokenDelta, quoteTokenDelta, baseTokenPrice } = calculateTradeEffects({
      baseToken,
      quoteToken,
      side: order.side,
      quantity: parsedQuantity,
    });

    try {
      const settleOrder = await this.prisma.$transaction(async (tx) => {
        await this.checkBalances(tx, walletId, baseToken, quoteToken, order.side, baseTokenDelta, quoteTokenDelta);
        await this.updateBalances(tx, walletId, baseToken, quoteToken, order.side, baseTokenDelta, quoteTokenDelta);
        await this.recordTransactions(tx, walletId, baseToken, quoteToken, order.side, baseTokenDelta, quoteTokenDelta);

        return tx.order.update({
          where: { id: order.orderId },
          data: {
            status: OrderStatus.FILLED,
            price: order.type === "MARKET" ? baseTokenPrice : order.price,
            filledQuantity: order.quantity,
          },
        });

        // return tx.order.create({
        //   data: {
        //     userId: order.userId,
        //     symbol: order.symbol,
        //     side: order.side,
        //     type: order.type,
        //     mode: order.mode,
        //     status: OrderStatus.FILLED,
        //     quantity: parsedQuantity,
        //     price: baseTokenPrice,
        //     filledQuantity: order.quantity,
        //   },
        // });
      });

      return settleOrder;
    } catch (error: unknown) {
      console.error("Error executing market order:", error);
      if (error instanceof Error) throw new AppError(error.message || "Failed to process market order", 500);
      throw new AppError("Failed to process market order", 500);
    }
  }

  private async checkBalances(
    tx: Prisma.TransactionClient,
    walletId: string,
    baseToken: string,
    quoteToken: string,
    side: OrderSide,
    baseTokenDelta: Decimal,
    quoteTokenDelta: Decimal,
  ) {
    const [quoteBalance, baseBalance] = await Promise.all([
      tx.tokenBalance.findUnique({
        where: { walletId_symbol: { walletId, symbol: quoteToken } },
        select: { balance: true },
      }),
      tx.tokenBalance.findUnique({
        where: { walletId_symbol: { walletId, symbol: baseToken } },
        select: { balance: true },
      }),
    ]);

    if (
      (side === OrderSide.BUY && (!quoteBalance || quoteBalance.balance.lessThan(quoteTokenDelta))) ||
      (side === OrderSide.SELL && (!baseBalance || baseBalance.balance.lessThan(baseTokenDelta)))
    ) {
      throw insufficientBalanceError(
        side === OrderSide.BUY ? quoteToken : baseToken,
        side === OrderSide.BUY ? quoteTokenDelta : baseTokenDelta,
        side === OrderSide.BUY ? quoteBalance?.balance : baseBalance?.balance,
      );
    }
  }

  private async updateBalances(
    tx: Prisma.TransactionClient,
    walletId: string,
    baseToken: string,
    quoteToken: string,
    side: OrderSide,
    baseTokenDelta: Decimal,
    quoteTokenDelta: Decimal,
  ) {
    const updatedQuote = await tx.tokenBalance.update({
      where: { walletId_symbol: { walletId, symbol: quoteToken } },
      data: {
        balance: side === OrderSide.BUY ? { decrement: quoteTokenDelta } : { increment: quoteTokenDelta },
      },
    });

    if (new Decimal(updatedQuote.balance).lessThan(0)) {
      throw insufficientBalanceError(quoteToken, quoteTokenDelta);
    }

    const token = tokenInfo.find((token) => token.symbol === baseToken);
    if (!token) throw new AppError("Base token is not found.", 404);

    const updatedBase = await tx.tokenBalance.upsert({
      where: { walletId_symbol: { walletId, symbol: baseToken } },
      update: {
        balance: side === OrderSide.BUY ? { increment: baseTokenDelta } : { decrement: baseTokenDelta },
      },
      create: {
        id: uuidv4(),
        walletId,
        balance: baseTokenDelta,
        name: token.name,
        symbol: token.symbol,
        icon: token.icon,
      },
    });

    if (new Decimal(updatedBase.balance).lessThan(0)) {
      throw insufficientBalanceError(baseToken, baseTokenDelta);
    }
  }

  private async recordTransactions(
    tx: Prisma.TransactionClient,
    walletId: string,
    baseToken: string,
    quoteToken: string,
    side: OrderSide,
    baseTokenDelta: Decimal,
    quoteTokenDelta: Decimal,
  ) {
    await tx.transaction.createMany({
      data: [
        {
          id: uuidv4(),
          walletId,
          symbol: quoteToken,
          amount: side === OrderSide.BUY ? quoteTokenDelta.negated() : quoteTokenDelta,
          type: "TRADE",
        },
        {
          id: uuidv4(),
          walletId,
          symbol: baseToken,
          amount: side === OrderSide.BUY ? baseTokenDelta : baseTokenDelta.negated(),
          type: "TRADE",
        },
      ],
    });
  }
}
