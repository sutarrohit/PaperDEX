import WebSocket from "ws";
import { TokenPriceStore } from "../../store/tokenPriceStore";
import { IntervalKey } from "@paperdex/lib";

interface BinanceKline {
  e: "kline";
  E: number;
  s: string;
  k: {
    t: number;
    T: number;
    s: string;
    i: string;
    f: number;
    L: number;
    o: string;
    c: string;
    h: string;
    l: string;
    v: string;
    n: number;
    x: boolean;
    q: string;
    V: string;
    Q: string;
    B: string;
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
      const { o, c } = message.data.k;

      const openPrice = Number(o);
      const closePrice = Number(c);
      const symbol = message.data.s;

      const priceChange = ((closePrice - openPrice) / openPrice) * 100;
      const existing = TokenPriceStore.find((item) => item.token === symbol);

      if (existing) {
        existing[interval] = priceChange;
      } else {
        TokenPriceStore.push({ token: symbol, [interval]: priceChange });
      }
    } catch (error) {
      console.error(`[${interval}] Failed to parse message:`, error);
    }
  });
};
