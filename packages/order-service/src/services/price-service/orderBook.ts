/* eslint-disable @typescript-eslint/no-unused-vars */
import WebSocket from "ws";
import { orderBookSet } from "@paperdex/lib";
import { orderBooksStore } from "../../store/orderBookStore";

interface DepthData {
  lastUpdateId: number;
  bids: [string, string][]; // [price, quantity]
  asks: [string, string][];
}

interface BinanceWSMessage {
  stream: string;
  data: DepthData;
}

let binanceWS: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 5000;

export const orderBook = () => {
  const wsUrl = `wss://stream.binance.com:9443/stream?streams=${orderBookSet}`;

  if (binanceWS) {
    binanceWS.removeAllListeners();
    binanceWS.close();
  }

  binanceWS = new WebSocket(wsUrl);

  binanceWS.on("open", () => {
    console.log("Connected to Binance WebSocket server");
    reconnectAttempts = 0;
  });

  binanceWS.on("close", (code: number, reason: Buffer) => {
    console.log(`Binance connection closed. Code: ${code}, Reason: ${reason.toString()}`);
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(orderBook, RECONNECT_DELAY_MS);
    } else {
      console.error("Max reconnection attempts reached. Giving up.");
    }
  });

  binanceWS.on("error", (error: Error) => {
    console.error("Binance WS error", error);
    binanceWS?.close();
  });

  binanceWS.on("message", (data: WebSocket.Data) => {
    try {
      const message: BinanceWSMessage = JSON.parse(data.toString());

      const streamSymbol = message.stream?.split("@")[0];
      if (!streamSymbol) return;

      const symbol = streamSymbol.toLowerCase();
      const { bids, asks } = message.data;

      const formattedBids: [string, string][] = bids
        .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
        .slice(0, 20)
        .map(([price, quantity]) => [price, quantity] as [string, string]);

      const formattedAsks: [string, string][] = asks
        .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
        .slice(0, 20)
        .map(([price, quantity]) => [price, quantity] as [string, string]);

      console.log("symbol====================>", symbol);
      console.log("formattedBids====================>", formattedBids);
      console.log("formattedAsks====================>", formattedAsks);

      orderBooksStore[symbol] = {
        bids: formattedBids,
        asks: formattedAsks,
      };
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  });
};
