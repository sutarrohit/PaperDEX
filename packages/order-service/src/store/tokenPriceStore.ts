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

export const TokenPriceStore: Record<string, number> = {};

export const getTokenPrice = (token: string) => {
  const tokenName = token === "USDT" ? `${token.toUpperCase()}DAI` : `${token.toUpperCase()}USDT`;

  return {
    token,
    price: TokenPriceStore[tokenName],
  };
};
