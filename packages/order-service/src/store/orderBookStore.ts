/**
 * ==========================================
 * This object holds the latest order book data
 * received from Binance WebSocket streams.
 *
 * Key:   Trading pair symbol (e.g., "ethusdt")
 * Value: OrderBookData containing current bids and asks
 *
 * Used as an in-memory store to keep track of
 * real-time market depth for each symbol.
 * ==========================================
 */

export type OrderBookSide = [string, string][]; // Array of [price, quantity] pairs

export interface OrderBookData {
  bids: OrderBookSide;
  asks: OrderBookSide;
}

export const orderBooksStore: Record<string, OrderBookData> = {};
