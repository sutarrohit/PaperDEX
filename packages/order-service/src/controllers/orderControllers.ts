import { NextFunction, Request, Response, RequestHandler } from "express";
import { AppError, catchAsync } from "@paperdex/lib";
import { getUserDetails } from "../services/userService";
import { prisma } from "@paperdex/db";
import { marketOrder } from "../services/orderService";

// Get all account orders; active, canceled, or filled.
export const getAllOrders: RequestHandler = catchAsync(async (req: Request, res: Response) => {});

export const getOrder: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  res.json(req.user);
});

export const newOrder: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  console.log("req.body=======================>", req.body);

  const { side, type, symbol, quantity, price } = req.body;
  if (!side || !type || !symbol || !quantity) throw new AppError("Missing required fields", 400);

  const user = await getUserDetails(req.user?.user.id!);

  const market = await prisma.market.findUnique({
    where: {
      symbol: symbol,
    },
  });

  if (!market || !market.isActive) throw new AppError("Invalid or inactive market", 404);

  const order = await marketOrder({ userId: user.id, symbol, side, type, quantity, price });

  console.log("market===============>", market);

  res.json({
    status: "success",
    data: order,
  });
});

export const cancelOrder: RequestHandler = catchAsync(async (req: Request, res: Response) => {});
