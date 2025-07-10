import { Request, Response, RequestHandler } from "express";
import { prisma } from "@paperdex/db";

import { AppError, catchAsync } from "@paperdex/lib";
import { calculateTokenBalance } from "../services/totalBalance";

export const getUserAccount: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
    },
  });

  if (!user) throw new AppError("User not found", 404);

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const getBalances: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.user?.id;
  const tokenQuery = req.query.tokens;

  const tokens: string[] = Array.isArray(tokenQuery)
    ? tokenQuery.map((t) => (typeof t === "string" ? t : "")).filter((t): t is string => t.length > 0)
    : typeof tokenQuery === "string"
      ? tokenQuery.split(",")
      : [];

  const balances = await prisma.wallet.findUnique({
    where: { userId: userId },
    include: {
      balances: {
        where:
          tokens.length > 0
            ? {
                symbol: { in: tokens },
              }
            : undefined,
      },
    },
  });

  if (!balances) throw new AppError("Token balance not found", 404);

  res.status(200).json({
    status: "success",
    data: balances,
  });
});

export const getUserStats: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req?.user?.user) throw new AppError("User not found.", 404);

  const [pendingOrders] = await Promise.all([
    prisma.order.count({
      where: {
        userId: req?.user?.user.id,
        status: "PENDING",
      },
    }),
  ]);

  const userId = req?.user?.user?.id;
  if (!userId) throw new AppError("User ID not found.", 404);

  const totalBalance = await calculateTokenBalance(userId);

  const data = {
    pendingTx: pendingOrders,
    totalBalance: totalBalance,
  };

  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getUserDailyBalance: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.user?.id;
  if (!userId) throw new AppError("User ID not found.", 404);

  const data = await prisma.dailyBalance.findMany({
    where: { userId },
    orderBy: { date: "asc" },
    select: {
      date: true,
      balance: true,
    },
  });

  const balance = data.map((entry) => ({
    date: entry.date.toISOString().split("T")[0],
    totalBalance: Number(entry.balance),
  }));

  // ⛳️ If only one entry exists, add a fake one for the previous day
  if (balance.length === 1) {
    const current = balance[0];
    if (current && typeof current.date === "string") {
      const prevDate = new Date(current.date as string);
      prevDate.setDate(prevDate.getDate() - 1); // go back one day

      balance.unshift({
        date: prevDate.toISOString().split("T")[0],
        totalBalance: current.totalBalance,
      });
    }
  }

  res.status(200).json({
    status: "success",
    data: balance,
  });
});
