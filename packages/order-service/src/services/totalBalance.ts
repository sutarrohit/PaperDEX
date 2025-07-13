import { prisma } from "@paperdex/db";
import { AppError } from "@paperdex/lib";
import { getTokenPrice } from "../store/tokenPriceStore";

export const calculateTokenBalance = async (userId: string): Promise<number> => {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    select: {
      balances: true,
    },
  });

  let totalBalance = 0;

  if (!wallet) throw new AppError("User not found", 404);

  if (wallet.balances) {
    for (const token of wallet.balances) {
      if (token.symbol === "USDT") {
        totalBalance += Number(token.balance);
        continue;
      }

      const tokenPrice = getTokenPrice([token.symbol]);

      if (!tokenPrice[0]?.price) continue;

      const tokenBalance = Number(token.balance) * Number(tokenPrice[0]?.price);
      totalBalance += tokenBalance;
    }
  }

  return totalBalance;
};

export const getTopHoldingToken = async (userId: string) => {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
    select: {
      balances: true,
    },
  });

  if (!wallet) throw new AppError("User not found", 404);

  let topToken = null;
  let maxValue = 0;
  let usdtToken = null;

  if (wallet.balances) {
    for (const token of wallet.balances) {
      let tokenValue = 0;

      if (token.symbol === "USDT") {
        tokenValue = Number(token.balance);
        usdtToken = {
          name: token.name,
          symbol: token.symbol,
          icon: token.icon,
          balance: Number(token.balance),
          value: tokenValue,
        };
      } else {
        const tokenPrice = await getTokenPrice([token.symbol]);

        if (!tokenPrice[0]?.price) continue;

        tokenValue = Number(token.balance) * Number(tokenPrice[0].price);
      }

      if (tokenValue > maxValue) {
        maxValue = tokenValue;
        topToken = {
          name: token.name,
          symbol: token.symbol,
          icon: token.icon,
          balance: Number(token.balance),
          value: tokenValue,
        };
      }
    }
  }

  return {
    topHolding: topToken || usdtToken, // Fallback to USDT if no other token exists
    usdt: usdtToken,
  };
};
