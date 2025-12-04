import { Request, Response, RequestHandler } from "express";
import { AppError, catchAsync } from "@paperdex/lib";
import { getUserDetails } from "../services/userService";
import { OrderStatus, OrderSide, OrderType, prisma } from "@paperdex/db";
import { OrderSchema, OrderWithUserIdANDOrderId } from "../utils/schema.ts/orderSchema";
import { NewOrder } from "../classes/newOrder";
import { getTokenPrice } from "../store/tokenPriceStore";
import { RedisSet } from "../classes/createOrder";

// Get all account orders, active, canceled, or filled.
export const getAllOrders: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const pageIndex = parseInt((req.query.pageIndex as string) || "1");
  const pageSize = Math.min(parseInt(req.query.pageSize as string), 20);
  const skip = (pageIndex - 1) * pageSize;

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

    prisma.order.count({ where: { userId: userId, ...(orderStatus && { status: orderStatus }) } }),
  ]);

  res.status(200).json({
    status: "success",
    size: orderCount,
    currentPage: pageIndex,
    pageSize: pageSize,
    totalPages: Math.ceil(orderCount / pageSize),
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

  res.status(200).json({
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

  const removeOrder: OrderWithUserIdANDOrderId = {
    side: order.side,
    type: order.type,
    mode: order.mode,
    symbol: order.symbol,
    quantity: Number(order.quantity),
    price: Number(order.price),
    priceDirection: order.priceDirection,
    userId: order.userId as string,
    orderId: order.id,
  };

  await RedisSet.removeOrder(removeOrder);

  res.status(200).json({
    status: "success",
    data: canceledOrder,
  });
});

export const newOrder: RequestHandler = catchAsync(async (req, res) => {
  // ✅ Validate request body
  const { symbol: tokenSymbol, price, side } = req.body;
  const priceDirection = determinePriceDirection({
    symbol: tokenSymbol,
    price,
    side,
  });

  const orderData = { ...req.body, priceDirection };
  const parsed = OrderSchema.safeParse(orderData);

  if (!parsed.success) {
    const errorMessages = parsed.error.errors
      .map((e: { path: (string | number)[]; message: string }) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");
    throw new AppError(`Validation failed: ${errorMessages}`, 400);
  }

  if (!req?.user) throw new AppError("User not found", 404);
  const user = await getUserDetails(req.user.user.id as string);

  const { symbol } = parsed.data;
  const market = await prisma.market.findUnique({
    where: { symbol },
  });

  if (!market || !market.isActive) {
    throw new AppError("Invalid or inactive market", 404);
  }

  const newOrder = new NewOrder();
  const order = await newOrder.createNewOrder(parsed.data, user.id);

  res.status(200).json({
    status: "success",
    data: order,
  });
});

function determinePriceDirection(params: {
  symbol: string;
  price: number | null;
  side: "BUY" | "SELL";
}): "UP" | "DOWN" {
  const tokenName = params.symbol.split("/")[0]!;
  const latestTokenPrice = getTokenPrice([tokenName]);
  const tokenPriceObj = latestTokenPrice[0];

  if (!tokenPriceObj || tokenPriceObj?.price === undefined) {
    throw new AppError("Internal server error", 500);
  }

  if (params.price === null) {
    return "UP";
  }

  const marketPrice = tokenPriceObj.price;
  return marketPrice >= params.price ? "DOWN" : "UP";
}
