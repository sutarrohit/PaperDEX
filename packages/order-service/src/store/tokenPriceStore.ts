/**
 * ==========================================
 * This object holds the latest token prices
 * received from Binance WebSocket streams.
 *
 * Key:   Token symbol (e.g., "ETHUSDT")
 * Value: Latest price as a number (e.g., 1835.21)
 *
 * Used as an in-memory store for fast access
 * across the app.
 * ==========================================
 */

export type IntervalKey = "change_1hr" | "change_1d" | "change_1w";

export type TokenPriceStoreType = {
  token?: string;
  price?: number;
} & Partial<Record<IntervalKey, number>>;

export const TokenPriceStore: TokenPriceStoreType[] = [];

export const getTokenPrice = (tokens: string[] | []) => {
  if (tokens?.length === 0) return TokenPriceStore;

  return tokens
    .map((token) => {
      const tokenName = token === "USDT" ? `${token.toUpperCase()}DAI` : `${token.toUpperCase()}USDT`;
      return TokenPriceStore.find((tokenInfo) => tokenInfo.token === tokenName);
    })
    .filter((tokenInfo): tokenInfo is TokenPriceStoreType => Boolean(tokenInfo)); // removes undefined
};
