export const getTokenName = (symbol: string) => {
  switch (symbol.toUpperCase()) {
    case "USDT":
      return "USDTDAI";
    default:
      return `${symbol.toUpperCase()}USDT`;
  }
};
