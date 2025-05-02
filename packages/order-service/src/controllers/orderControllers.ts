import { NextFunction, Request, Response, RequestHandler } from "express";
import { AppError, catchAsync } from "@paperdex/lib";
import { getUserDetails } from "../services/userService";
import { OrderStatus, OrderSide, OrderType, prisma } from "@paperdex/db";
import { marketOrder } from "../services/orderService";

// Get all account orders, active, canceled, or filled.
export const getAllOrders: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || "1");
  const pageSize = Math.min(parseInt((req.query.size as string) || "10"), 10);
  const skip = (page - 1) * pageSize;

  const orderStatus = req.query.orderStatus as OrderStatus | null;
  const orderType = req.query.orderType as OrderType | null;
  const orderSide = req.query.orderSide as OrderSide | null;

  const userId = req.user?.user.id;

  const [orders, orderCount] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId,
        ...(orderStatus && { status: orderStatus }),
        ...(orderType && { type: orderType }),
        ...(orderSide && { side: orderSide }),
      },
      orderBy: {
        createdAt: "desc",
      },

      skip: skip,
      take: pageSize,
    }),

    prisma.order.count({ where: { userId: userId } }),
  ]);

  res.json({
    status: "success",
    size: orderCount,
    currentPage: page,
    pageSize: pageSize,
    data: orders,
  });
});

export const getOrder: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.query?.orderId?.toString().trim();

  if (!orderId) throw new AppError("Order id not found", 404);

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) throw new AppError("Order not found", 404);

  res.json({
    status: "success",
    data: order,
  });
});

export const newOrder: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const { side, type, symbol, quantity, price } = req.body;
  if (!side || !type || !symbol || !quantity) throw new AppError("Missing required fields", 400);

  const user = await getUserDetails(req.user?.user.id!);
  const market = await prisma.market.findUnique({
    where: { symbol: symbol },
  });

  if (!market || !market.isActive) throw new AppError("Invalid or inactive market", 404);

  const order = await marketOrder({ userId: user.id, symbol, side, type, quantity, price });

  res.json({
    status: "success",
    data: order,
  });
});

export const cancelOrder: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.body;

  if (!orderId) {
    throw new AppError("Order id or order status is missing", 400);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.status === "CANCELED") {
    throw new AppError("Order is already canceled", 400);
  }

  if (!["PENDING", "PARTIALLY_FILLED"].includes(order.status)) {
    throw new AppError(`Cannot cancel order with status: ${order.status}`, 400);
  }

  const canceledOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELED" },
  });

  res.json({
    status: "success",
    data: canceledOrder,
  });
});
