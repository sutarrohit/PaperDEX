// import { OrderSide, OrderStatus, OrderType, prisma } from "@paperdex/db";
// import { Decimal } from "../../../db/generated/client/runtime/library";
// import { getUserDetails } from "../services/userService";
// import { AppError, tryCatch } from "@paperdex/lib";

// type CreateOrderSchema = {
//   userId: string;
//   symbol: string;
//   side: OrderSide;
//   type: OrderType;
//   quantity: Decimal;
//   price?: Decimal | null;
// };

// export const marketOrder = async ({
//   userId,
//   symbol,
//   side,
//   type,
//   quantity,
//   price,
// }: CreateOrderSchema) => {
//   const [baseToken, quoteToken] = symbol.split("/");

//   const user = await getUserDetails(userId!);

//   const baseTokenBalance = user.wallet.balances.find((token) => token.symbol === baseToken);
//   const quoteTokenBalance = user.wallet.balances.find((token) => token.symbol === quoteToken);

//   console.log("quoteTokenBalance=========================>", quoteTokenBalance, side);

//   if (side === OrderSide.BUY) {

//     if (!quoteTokenBalance || quoteTokenBalance.balance < quantity)
//       throw new AppError(`You don't have ${quoteToken} Balance`, 400);

//     const totalCost = price ? price.mul(quantity) : new Decimal(0);

//     const user = await getUserDetails(userId);
//     const walletId = user.wallet.id;

//     const { data, error } = await tryCatch(
//       prisma.$transaction([
//         // Decrease quote token balance (spending)
//         prisma.tokenBalance.update({
//           where: {
//             walletId_symbol: {
//               walletId,
//               symbol: quoteToken!,
//             },
//           },
//           data: {
//             balance: {
//               decrement: totalCost,
//             },
//           },
//         }),

//         // Increase base token balance (receiving) - using upsert
//         prisma.tokenBalance.upsert({
//           where: {
//             walletId_symbol: {
//               walletId,
//               symbol: baseToken!,
//             },
//           },
//           update: {
//             balance: {
//               increment: quantity,
//             },
//           },
//           create: {
//             id: "ca14095d-7154-4413-946d-1f0c79116897",
//             name: baseToken!,
//             symbol: baseToken!,
//             balance: quantity,
//             icon: `/icons/${baseToken!.toLowerCase()}.svg`,
//             walletId,
//           },
//         }),

//         // Record transactions
//         prisma.transaction.createMany({
//           data: [
//             {
//               id: "ca14095d-7154-4413-946d-1f0c79116897",
//               walletId,
//               symbol: quoteToken!,
//               amount: totalCost.negated(), // Negative for outgoing
//               type: "TRADE",
//             },
//             {
//               id: "ca14095d-7154-4413-946d-1f0c79116897",
//               walletId,
//               symbol: baseToken!,
//               amount: quantity,
//               type: "TRADE",
//             },
//           ],
//         }),

//         // Create the order record
//         prisma.order.create({
//           data: {
//             userId,
//             symbol,
//             side,
//             type,
//             status: OrderStatus.FILLED,
//             quantity,
//             price: OrderType.MARKET ? 2500 : price,
//             filledQuantity: quantity,
//           },
//         }),
//       ]),
//     );

//     console.log("error--------------------------", error);
//     console.log("data--------------------------", data);
//   }

//   const order = await prisma.order.create({
//     data: {
//       userId: userId,
//       symbol: symbol,
//       side: OrderSide[side as keyof typeof OrderSide],
//       type: OrderType[type as keyof typeof OrderType],
//       status: OrderStatus.FILLED,
//       quantity: await prisma.$executeRawUnsafe(`SELECT '${quantity}'::DECIMAL`),
//       price: type === OrderType.MARKET ? 2500 : price,
//     },
//   });

//   return order;
// };

// export const limitOrder = () => {};

import { OrderSide, OrderStatus, OrderType, prisma } from "@paperdex/db";
import { Decimal } from "../../../db/generated/client/runtime/library";
import { getUserDetails } from "../services/userService";
import { AppError } from "@paperdex/lib";
import { v4 as uuidv4 } from "uuid";

type CreateOrderSchema = {
  userId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: Decimal;
  price?: Decimal | null;
};

export const marketOrder = async ({
  userId,
  symbol,
  side,
  type,
  quantity,
  price = null,
}: CreateOrderSchema) => {
  const [baseToken, quoteToken] = symbol.split("/");

  if (!baseToken || !quoteToken) {
    throw new AppError("Invalid symbol format. Expected format: BASE/QUOTE", 400);
  }

  const user = await getUserDetails(userId);
  const walletId = user.wallet.id;

  // Get current market price if it's a market order
  const currentPrice =
    type === OrderType.MARKET
      ? new Decimal(2500) // Replace with actual price fetch logic
      : (price ?? new Decimal(0));

  try {
    if (side === OrderSide.BUY) {
      const quoteTokenBalance = user.wallet.balances.find((token) => token.symbol === quoteToken);

      const totalCost = currentPrice.mul(quantity);

      if (!quoteTokenBalance || quoteTokenBalance.balance.lessThan(totalCost)) {
        throw new AppError(`Insufficient ${quoteToken} balance`, 400);
      }

      const tx = await prisma.$transaction([
        // Decrease quote token balance (spending)
        prisma.tokenBalance.update({
          where: {
            walletId_symbol: {
              walletId,
              symbol: quoteToken,
            },
          },
          data: {
            balance: {
              decrement: totalCost,
            },
          },
        }),

        // Increase base token balance (receiving) - using upsert
        prisma.tokenBalance.upsert({
          where: {
            walletId_symbol: {
              walletId,
              symbol: baseToken,
            },
          },
          update: {
            balance: {
              increment: quantity,
            },
          },
          create: {
            id: uuidv4(),
            name: baseToken,
            symbol: baseToken,
            balance: quantity,
            icon: `/icons/${baseToken.toLowerCase()}.svg`,
            walletId,
          },
        }),

        // Record transactions
        prisma.transaction.createMany({
          data: [
            {
              id: uuidv4(),
              walletId,
              symbol: quoteToken,
              amount: totalCost.negated(), // Negative for outgoing
              type: "TRADE",
            },
            {
              id: uuidv4(),
              walletId,
              symbol: baseToken,
              amount: quantity,
              type: "TRADE",
            },
          ],
        }),

        // Create the order record
        prisma.order.create({
          data: {
            userId,
            symbol,
            side,
            type,
            status: OrderStatus.FILLED,
            quantity,
            price: currentPrice,
            filledQuantity: quantity,
          },
        }),
      ]);

      return tx[3]; // Return the order record
    } else {
      // SELL order logic would go here
      throw new AppError("Sell order logic not implemented", 501);
    }
  } catch (error) {
    console.error("Error executing market order:", error);
    throw new AppError("Failed to process market order", 500);
  }
};

export const limitOrder = () => {};
