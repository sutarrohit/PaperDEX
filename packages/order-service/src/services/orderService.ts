import { OrderSide, OrderStatus, OrderType, prisma } from "@paperdex/db";
import { Decimal } from "../../../db/generated/client/runtime/library";
import { getUserDetails } from "../services/userService";
import { AppError } from "@paperdex/lib";
import { v4 as uuidv4 } from "uuid";
import { calculateTradeEffects } from "./tradeService";
import { insufficientBalanceError } from "@paperdex/lib";

type CreateOrderSchema = {
  userId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: Decimal;
  price?: Decimal | null;
};

export const marketOrder = async ({ userId, symbol, side, type, quantity, price = null }: CreateOrderSchema) => {
  const [baseToken, quoteToken] = symbol.split("/");

  if (!baseToken || !quoteToken) {
    throw new AppError("Invalid symbol format. Expected format: BASE/QUOTE", 400);
  }

  const user = await getUserDetails(userId);
  const walletId = user.wallet.id;

  const { baseTokenDelta, quoteTokenDelta, baseTokenPrice } = calculateTradeEffects({
    baseToken,
    quoteToken,
    side,
    quantity,
  });

  try {
    const order = await prisma.$transaction(async (tx) => {
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

      // Update quote token
      const updatedQuote = await tx.tokenBalance.update({
        where: { walletId_symbol: { walletId, symbol: quoteToken } },
        data: {
          balance: side === OrderSide.BUY ? { decrement: quoteTokenDelta } : { increment: quoteTokenDelta },
        },
      });

      if (new Decimal(updatedQuote.balance).lessThan(0)) {
        throw insufficientBalanceError(quoteToken, quoteTokenDelta);
      }

      // Update or create base token
      const updatedBase = await tx.tokenBalance.upsert({
        where: { walletId_symbol: { walletId, symbol: baseToken } },
        update: {
          balance: side === OrderSide.BUY ? { increment: baseTokenDelta } : { decrement: baseTokenDelta },
        },
        create: {
          id: uuidv4(),
          name: baseToken,
          symbol: baseToken,
          balance: baseTokenDelta,
          icon: `/icons/${baseToken.toLowerCase()}.svg`,
          walletId,
        },
      });

      if (new Decimal(updatedBase.balance).lessThan(0)) {
        throw insufficientBalanceError(baseToken, baseTokenDelta);
      }

      // Record transactions
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

      // Create final order
      return tx.order.create({
        data: {
          userId,
          symbol,
          side,
          type,
          status: OrderStatus.FILLED,
          quantity,
          price: baseTokenPrice,
          filledQuantity: quantity,
        },
      });
    });

    return order;
  } catch (error: any) {
    console.error("Error executing market order:", error);
    throw new AppError(error?.message || "Failed to process market order", 500);
  }
};

export const limitOrder = () => {};
