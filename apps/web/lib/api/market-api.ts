const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE;

export const getMarketData = async (pageIndex = 0, pageSize = 10) => {
  const response = await fetch(
    `${ORDER_SERVICE_URL}/api/v1/token/tokenMarketData?pageIndex=${pageIndex + 1}&pageSize=${pageSize}`,
  );
  return response.json();
};

export const getTradeData = async (tokenName: string) => {
  const response = await fetch(`${ORDER_SERVICE_URL}/api/v1/token/tokenTradeData?token=${tokenName}`);
  return response.json();
};

export const getOrderBookData = async (tokenName: string) => {
  const response = await fetch(`${ORDER_SERVICE_URL}/api/v1/token/orderBooks?token=${tokenName}`);
  return response.json();
};
