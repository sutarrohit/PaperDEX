import Websocket from "ws";
import { TokenPriceStore } from "../store/tokenPriceStore";
import { tokenSet } from "@paperdex/lib";

interface BinanceTradeEvent {
  e: "trade"; // Event type
  E: number; // Event time
  s: string; // Symbol (e.g., ETHUSDT)
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  T: number; // Trade time
  m: boolean; // Is buyer the market maker?
  M: boolean; // Ignore
}

interface BinanceWSMessage {
  stream: string;
  data: BinanceTradeEvent;
}

export const fetchTokenPrices = () => {
  const wsUrl = `wss://stream.binance.com:9443/stream?streams=${tokenSet}`;
  const binanceWS = new Websocket(wsUrl);

  binanceWS.on("open", () => {
    console.log("Connected to Binance WebSocket server");
  });

  binanceWS.on("close", (code: number, reason: Buffer) => {
    console.log(`Binance connection closed. Code: ${code}, Reason: ${reason.toString()}`);
  });

  binanceWS.on("error", (error: Error) => {
    console.log("Binance WS error", error);
  });

  binanceWS.onmessage = (event: any) => {
    try {
      const message: BinanceWSMessage = JSON.parse(event?.data);
      const { s: symbol, p: price } = message.data;
      TokenPriceStore[symbol] = Number(price);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  };
};
