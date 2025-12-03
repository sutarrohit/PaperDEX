// import WebSocket from "ws";
// import { TokenPriceStore } from "../../store/tokenPriceStore";

// interface BinanceTradeEvent {
//   e: "trade"; // Event type
//   E: number; // Event time
//   s: string; // Symbol (e.g., ETHUSDT)
//   t: number; // Trade ID
//   p: string; // Price
//   q: string; // Quantity
//   T: number; // Trade time
//   m: boolean; // Is buyer the market maker?
//   M: boolean; // Ignore
// }

// interface BinanceWSMessage {
//   stream: string;
//   data: BinanceTradeEvent;
// }

// let binanceWS: WebSocket | null = null;
// let reconnectAttempts = 0;
// const MAX_RECONNECT_ATTEMPTS = 5;
// const RECONNECT_DELAY_MS = 5000;

// export const fetchTokenPrices = (tokenSet: string) => {
//   const wsUrl = `wss://stream.binance.com:9443/stream?streams=${tokenSet}`;

//   // Clean up previous connection if it exists
//   if (binanceWS) {
//     binanceWS.removeAllListeners();
//     binanceWS.close();
//   }

//   binanceWS = new WebSocket(wsUrl);

//   binanceWS.on("open", () => {
//     console.log("Connected to Binance WebSocket server");
//     reconnectAttempts = 0; // Reset reconnect attempts on successful connection
//   });

//   binanceWS.on("close", (code: number, reason: Buffer) => {
//     console.log(`Binance connection closed. Code: ${code}, Reason: ${reason?.toString()}`);
//     if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
//       reconnectAttempts++;
//       console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
//       setTimeout(fetchTokenPrices, RECONNECT_DELAY_MS);
//     } else {
//       console.error("Max reconnection attempts reached. Giving up.");
//     }
//   });

//   binanceWS.on("error", (error: Error) => {
//     console.error("Binance WS error", error);
//     binanceWS?.close(); // Ensure the connection is closed so we can reconnect
//   });

//   binanceWS.on("message", (data: WebSocket.Data) => {
//     try {
//       const message: BinanceWSMessage = JSON.parse(data?.toString());
//       const { s: symbol, p: price } = message.data;

//       const existing = TokenPriceStore.find((item) => item.token === symbol);

//       if (existing) {
//         existing.price = Number(price);
//       } else {
//         TokenPriceStore.push({ token: symbol, price: Number(price) });
//       }
//     } catch (error) {
//       console.error("Failed to parse WebSocket message:", error);
//     }
//   });
// };

import WebSocket from "ws";
import fs from "fs";
import path from "path";
import { TokenPriceStore } from "../../store/tokenPriceStore";

// ✅ Error log file path
const LOG_FILE = path.join(process.cwd(), "binance-ws-errors.txt");

// ✅ Helper function to append errors
function logErrorToFile(message: string, error?: unknown) {
  const time = new Date().toISOString();
  const fullMessage = `[${time}] ${message}\n${error ? JSON.stringify(error, null, 2) : ""}\n\n`;

  fs.appendFile(LOG_FILE, fullMessage, (err) => {
    if (err) console.error("Failed to write error log:", err);
  });
}

interface BinanceTradeEvent {
  e: "trade";
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  T: number;
  m: boolean;
  M: boolean;
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
    const msg = `Connection closed. Code: ${code}, Reason: ${reason?.toString()}`;
    console.log(msg);
    logErrorToFile(msg);

    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`Reconnecting (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(() => fetchTokenPrices(tokenSet), RECONNECT_DELAY_MS);
    } else {
      const failMsg = "Max reconnection attempts reached. Giving up.";
      console.error(failMsg);
      logErrorToFile(failMsg);
    }
  });

  binanceWS.on("error", (error: Error) => {
    console.error("Binance WS error", error);
    logErrorToFile("WebSocket Error", error);
    binanceWS?.close();
  });

  binanceWS.on("message", (data: WebSocket.Data) => {
    try {
      const message: BinanceWSMessage = JSON.parse(data.toString());
      const { s: symbol, p: price } = message.data;

      const existing = TokenPriceStore.find((item) => item.token === symbol);

      if (existing) {
        existing.price = Number(price);
      } else {
        TokenPriceStore.push({ token: symbol, price: Number(price) });
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
      logErrorToFile("JSON Parse Error", error);
    }
  });
};
