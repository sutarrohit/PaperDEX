import { prisma } from "@paperdex/db";
import { AppError } from "@paperdex/lib";
import { getTokenPrice } from "../store/tokenPriceStore";

export const calculateActualBalance = async (userId: string): Promise<number> => {
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
