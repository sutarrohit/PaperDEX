import { prisma } from "@paperdex/db";
import { Decimal } from "../../../db/generated/client/runtime/library";

export const updateDailyBalance = async () => {
  // Get all users with their wallets and token balances
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

  for (const user of users) {
    const balances = user.wallet?.balances || [];

    // Calculate total balance by summing token balances
    const totalBalance = balances.reduce((acc, token) => {
      return acc.plus(new Decimal(token.balance));
    }, new Decimal(0));

    // Store or update daily balance record
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
