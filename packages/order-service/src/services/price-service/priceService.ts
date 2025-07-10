import WebSocket from "ws";
import { TokenPriceStore } from "../../store/tokenPriceStore";

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

let binanceWS: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 5000;

export const fetchTokenPrices = (tokenSet: string) => {
  const wsUrl = `wss://stream.binance.com:9443/stream?streams=${tokenSet}`;

  // Clean up previous connection if it exists
  if (binanceWS) {
    binanceWS.removeAllListeners();
    binanceWS.close();
  }

  binanceWS = new WebSocket(wsUrl);

  binanceWS.on("open", () => {
    console.log("Connected to Binance WebSocket server");
    reconnectAttempts = 0; // Reset reconnect attempts on successful connection
  });

  binanceWS.on("close", (code: number, reason: Buffer) => {
    console.log(`Binance connection closed. Code: ${code}, Reason: ${reason?.toString()}`);
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(fetchTokenPrices, RECONNECT_DELAY_MS);
    } else {
      console.error("Max reconnection attempts reached. Giving up.");
    }
  });

  binanceWS.on("error", (error: Error) => {
    console.error("Binance WS error", error);
    binanceWS?.close(); // Ensure the connection is closed so we can reconnect
  });

  binanceWS.on("message", (data: WebSocket.Data) => {
    try {
      const message: BinanceWSMessage = JSON.parse(data?.toString());
      const { s: symbol, p: price } = message.data;

      const existing = TokenPriceStore.find((item) => item.token === symbol);

      if (existing) {
        existing.price = Number(price);
      } else {
        TokenPriceStore.push({ token: symbol, price: Number(price) });
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  });
};
