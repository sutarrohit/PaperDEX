import { handleResponse } from "@/utils/handleResponse";

const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE;

export const getMarketData = async (pageIndex = 0, pageSize = 10) => {
  const response = await fetch(
    `${ORDER_SERVICE_URL}/api/v1/token/tokenMarketData?pageIndex=${pageIndex + 1}&pageSize=${pageSize}`,
  );
  return handleResponse(response);
};

export const getTradeData = async (tokenName: string) => {
  const response = await fetch(
    `${ORDER_SERVICE_URL}/api/v1/token/tokenTradeData?token=${encodeURIComponent(tokenName)}`,
  );
  return handleResponse(response);
};

export const getOrderBookData = async (tokenName: string) => {
  const response = await fetch(`${ORDER_SERVICE_URL}/api/v1/token/orderBooks?token=${encodeURIComponent(tokenName)}`);
  return handleResponse(response);
};
