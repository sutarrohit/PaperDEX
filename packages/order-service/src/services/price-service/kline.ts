import WebSocket from "ws";
import { TokenPriceStore } from "../../store/tokenPriceStore";
import { IntervalKey } from "@paperdex/lib";

interface BinanceKline {
  e: "kline"; // Event type
  E: number; // Event time (timestamp in milliseconds)
  s: string; // Symbol (e.g., BTCUSDT)
  k: {
    // Kline (candlestick) data
    t: number; // Kline start time
    T: number; // Kline close time
    s: string; // Symbol
    i: string; // Interval (e.g., 1m, 5m, 1h)
    f: number; // First trade ID
    L: number; // Last trade ID
    o: string; // Open price
    c: string; // Close price
    h: string; // High price
    l: string; // Low price
    v: string; // Base asset volume
    n: number; // Number of trades
    x: boolean; // Is this kline closed?
    q: string; // Quote asset volume
    V: string; // Taker buy base asset volume
    Q: string; // Taker buy quote asset volume
    B: string; // Ignore (typically reserved for future use)
  };
}

interface BinanceWSMessage {
  stream: string;
  data: BinanceKline;
}

const wsConnections: Map<string, WebSocket> = new Map();
const reconnectAttemptsMap: Map<string, number> = new Map();

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 5000;

export const fetchKline = (klineSets: string, interval: IntervalKey) => {
  const wsUrl = `wss://stream.binance.com:9443/stream?streams=${klineSets}`;

  const existingWS = wsConnections.get(interval);
  if (existingWS) {
    existingWS.removeAllListeners();
    existingWS.close();
  }

  const ws = new WebSocket(wsUrl);
  wsConnections.set(interval, ws);

  ws.on("open", () => {
    console.log(`[${interval}] Connected to Binance WebSocket`);
    reconnectAttemptsMap.set(interval, 0);
  });

  ws.on("close", (code: number, reason: Buffer) => {
    console.log(`[${interval}] Connection closed. Code: ${code}, Reason: ${reason.toString()}`);
    const attempts = (reconnectAttemptsMap.get(interval) || 0) + 1;

    if (attempts <= MAX_RECONNECT_ATTEMPTS) {
      reconnectAttemptsMap.set(interval, attempts);
      console.log(`[${interval}] Attempting to reconnect (${attempts}/${MAX_RECONNECT_ATTEMPTS})...`);
      setTimeout(() => fetchKline(klineSets, interval), RECONNECT_DELAY_MS);
    } else {
      console.error(`[${interval}] Max reconnection attempts reached. Giving up.`);
    }
  });

  ws.on("error", (error: Error) => {
    console.error(`[${interval}] Binance WS error:`, error);
    ws.close();
  });

  ws.on("message", (data: WebSocket.Data) => {
    try {
      const message: BinanceWSMessage = JSON.parse(data.toString());

      const { o, c, h, l, i } = message.data.k;

      const openPrice = Number(o);
      const closePrice = Number(c);
      const highPrice = Number(h);
      const lowPrice = Number(l);

      const symbol = message.data.s;

      const priceChange = ((closePrice - openPrice) / openPrice) * 100;
      const existing = TokenPriceStore.find((item) => item.token === symbol);

      if (existing) {
        existing[interval] = priceChange;
        // Add 24hr high and low price
        if (i === "1d") {
          existing["high_24hr"] = highPrice;
          existing["low_24hr"] = lowPrice;
        }
      } else {
        // Create a single new entry with all properties
        const newEntry = { token: symbol, [interval]: priceChange };
        if (i === "1d") {
          newEntry["high_24hr"] = highPrice;
          newEntry["low_24hr"] = lowPrice;
        }
        TokenPriceStore.push(newEntry);
      }
    } catch (error) {
      console.error(`[${interval}] Failed to parse message:`, error);
    }
  });
};
