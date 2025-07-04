import { WebSocketServer, WebSocket } from "ws";
import { orderBooksStore } from "../../store/orderBookStore";
import { TokenPriceStore } from "../../store/tokenPriceStore";
import { getTokenName, tokenInfo } from "@paperdex/lib";
import { parse } from "url";

type ClientWithPagination = {
  socket: WebSocket;
  pageIndex: number;
  pageSize: number;
};

export const handlePriceStream = (wss: WebSocketServer) => {
  const clients = new Set<ClientWithPagination>();

  wss.on("connection", (ws) => {
    const clientData: ClientWithPagination = {
      socket: ws,
      pageIndex: 1,
      pageSize: 10,
    };

    clients.add(clientData);

    ws.send(JSON.stringify({ message: "Welcome to orderbook stream!" }));

    ws.on("message", (message: string) => {
      try {
        const { pageIndex, pageSize } = JSON.parse(message);
        if (typeof pageIndex === "number" && typeof pageSize === "number" && pageIndex >= 1 && pageSize >= 1) {
          clientData.pageIndex = pageIndex;
          clientData.pageSize = pageSize;
        }
      } catch (err) {
        console.error("Invalid message from client:", message, err);
      }
    });

    ws.on("close", () => {
      clients.delete(clientData);
      console.log("Client disconnected from /stream/orderbook");
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:----------", err);
    });
  });

  setInterval(() => {
    for (const client of clients) {
      const { socket, pageIndex, pageSize } = client;

      if (socket.readyState !== socket.OPEN) continue;

      const skip = (pageIndex - 1) * pageSize;
      const paginatedTokenInfo = tokenInfo?.slice(skip, skip + pageSize);

      const updatedTokenInfo = paginatedTokenInfo.map((token) => {
        const priceInfo = TokenPriceStore?.find((data) => data.token === getTokenName(token.symbol));
        return {
          ...token,
          price: priceInfo?.price,
          change_1hr: priceInfo?.change_1hr ?? null,
          change_1d: priceInfo?.change_1d ?? null,
          change_1w: priceInfo?.change_1w ?? null,
          market_cap: priceInfo?.market_cap ?? null,
          volume_24hr: priceInfo?.volume_24hr ?? null,
        };
      });

      const totalPages = Math.ceil(tokenInfo.length / pageSize);

      socket.send(JSON.stringify({ data: updatedTokenInfo, totalPages }));
    }
  }, 1000);
};

export const handleOrderbookStream = (wss: WebSocketServer) => {
  // Keep track of clients and their subscribed token pair
  const clients = new Map<WebSocket, string>();

  wss.on("connection", (ws, req) => {
    const { query } = parse(req.url || "", true);
    const tokenPair = query.pair as string;

    if (!tokenPair) {
      ws.send(JSON.stringify({ error: "Missing 'pair' query parameter" }));
      ws.close();
      return;
    }

    const normalizedToken = tokenPair.split("_").join("").toLocaleLowerCase();
    clients.set(ws, normalizedToken);

    console.log(`Client connected to /stream/orderbook for pair: ${tokenPair}`);

    ws.send(JSON.stringify({ message: `Subscribed to ${tokenPair} orderbook stream.` }));

    ws.on("close", () => {
      clients.delete(ws);
      console.log(`Client disconnected from /stream/orderbook for pair: ${tokenPair}`);
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
    });
  });

  setInterval(() => {
    for (const [client, tokenKey] of clients.entries()) {
      if (client.readyState === WebSocket.OPEN) {
        const orderBook = orderBooksStore[tokenKey];
        if (orderBook) {
          client.send(JSON.stringify({ [tokenKey]: orderBook }));
        }
      }
    }
  }, 1000);
};

export const handleTokenTradeStream = (wss: WebSocketServer) => {
  const clients = new Map<WebSocket, string>();

  wss.on("connection", (ws, req) => {
    const { query } = parse(req.url || "", true);
    const tokenPair = query.token as string;

    if (!tokenPair) {
      ws.send(JSON.stringify({ error: "Missing 'token' query parameter" }));
      ws.close();
      return;
    }

    const normalizedToken = tokenPair.split("_").join("");
    clients.set(ws, normalizedToken);

    console.log(`Client connected to /stream/tokenTrade for token: ${tokenPair}`);
    ws.send(JSON.stringify({ message: `Subscribed to ${tokenPair} token trade stream.` }));

    ws.on("close", () => {
      clients.delete(ws);
      console.log(`Client disconnected from /stream/tokenTrade for token: ${tokenPair}`);
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
    });
  });

  setInterval(() => {
    for (const [client, tokenKey] of clients.entries()) {
      if (client.readyState !== WebSocket.OPEN) continue;

      const token = TokenPriceStore.find((t) => t.token === tokenKey);
      const tokenData = tokenInfo.find((td) => getTokenName(td.symbol) === tokenKey);

      if (token && tokenData) {
        const data = { ...tokenData, ...token };
        client.send(JSON.stringify({ data }));
      }
    }
  }, 1000);
};
