import { PrismaClient } from "../generated/client";
import { v4 as uuidv4 } from "uuid";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };
export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

/**
 * Generates a wallet with a USDT balance.
 */
function generateWallet() {
  return {
    create: {
      balances: {
        create: [
          {
            name: "Tether USD",
            symbol: "USDT",
            balance: 10000,
            icon: "https://bin.bnbstatic.com/static/assets/logos/USDT.png",
          },
        ],
      },
    },
  };
}

// Middleware to attach wallet + create initial daily balance
prisma.$use(async (params, next) => {
  if (params.model === "User" && params.action === "create") {
    // Attach wallet if not provided
    if (!params.args.data?.wallet && !params.args.data?.walletId) {
      params.args.data = {
        ...params.args.data,
        wallet: generateWallet(), // ✅ fix: call the function
      };
    }

    const result = await next(params);

    // Create DailyBalance after user is created
    if (result) {
      await prisma.dailyBalance.create({
        data: {
          id: uuidv4(),
          userId: result.id,
          date: new Date(),
          balance: 10000,
        },
      });
    }

    return result;
  }

  return next(params);
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
