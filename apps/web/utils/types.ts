export type TokenBalance = {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  icon: string;
  walletId: string;
};

export type UserWalletData = {
  id: string;
  userId: string;
  balances: TokenBalance[];
};

export type GetTradeTokenBalanceResponse = {
  status: "success";
  data: UserWalletData;
};

// -------------------------------------------------

export type TradeOrder = {
  id: string;
  userId: string;
  side: "BUY" | "SELL";
  type: "LIMIT" | "MARKET"; // Add other types if applicable
  mode: "SPOT" | "FUTURES"; // Add other modes if applicable
  status: "PENDING" | "COMPLETED" | "CANCELLED"; // Extend with other statuses if needed
  symbol: string;
  quantity: string;
  price: string;
  priceDirection: "UP" | "DOWN" | "NONE"; // Add other directions if applicable
  filledQuantity: string;
  createdAt: string;
  updatedAt: string;
};

export type TradeOrderResponse = {
  status: "success" | "error"; // Depending on API responses
  size: number;
  currentPage: number;
  pageSize: number;
  data: TradeOrder[];
};
