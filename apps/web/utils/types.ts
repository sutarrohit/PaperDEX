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
