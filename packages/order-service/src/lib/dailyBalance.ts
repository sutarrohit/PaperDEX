import { prisma } from "@paperdex/db";
import { Decimal } from "../../../db/generated/client/runtime/library";
import { getTokenPrice } from "../store/tokenPriceStore";
import { getTokenName } from "@paperdex/lib";

export const updateDailyBalance = async () => {
  const users = await prisma.user.findMany({
    include: {
      wallet: {
        include: {
          balances: true,
        },
      },
    },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // normalize to start of day

  // Get token prices
  const tokenPrices = getTokenPrice([]);

  // Create a lookup map for token → price
  const priceMap = new Map<string, number>();
  for (const tp of tokenPrices) {
    if (tp.token && typeof tp.price === "number") {
      priceMap.set(tp.token.toUpperCase(), tp.price);
    }
  }

  for (const user of users) {
    const balances = user.wallet?.balances || [];

    const totalBalance = balances.reduce((acc, token) => {
      const symbol = token?.symbol?.toUpperCase();
      const normalizedSymbol = getTokenName(symbol); // e.g., WETH → ETH

      if (normalizedSymbol === "USDT") {
        return acc.plus(new Decimal(token.balance)); // add USDT directly
      }

      const price = priceMap.get(normalizedSymbol);

      if (!price) return acc;

      const balanceInUSDT = new Decimal(token.balance).mul(price);
      return acc.plus(balanceInUSDT);
    }, new Decimal(0));

    console.log("User:", user.id, "Total Balance in USDT:", totalBalance.toString());

    await prisma.dailyBalance.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      update: {
        balance: totalBalance,
      },
      create: {
        userId: user.id,
        date: today,
        balance: totalBalance,
      },
    });
  }
};
