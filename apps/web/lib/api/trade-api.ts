import { handleResponse } from "@/utils/handleResponse";
import { TradingPanelSchema } from "@/components/form/trading-panel/schema";
import { z } from "zod";

const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE;

export const createTrade = async (data: z.infer<typeof TradingPanelSchema>) => {
  const response = await fetch(`${ORDER_SERVICE_URL}/api/v1/order/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const cancelOrder = async (orderId: string) => {
  const response = await fetch(`${ORDER_SERVICE_URL}/api/v1/order/cancelOrder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ orderId }),
  });

  return handleResponse(response);
};

export const getOrderHistory = async (orderStatus: string | null, pageIndex = 0, pageSize = 10) => {
  const response = await fetch(
    `${ORDER_SERVICE_URL}/api/v1/order/allOrders?orderStatus=${orderStatus}&pageIndex=${pageIndex + 1}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  return handleResponse(response);
};
