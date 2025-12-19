import http from "http";
import dotenv from "dotenv";
import { WSserver } from "./services/price-service";

import { orderBook } from "./services/price-service/orderBook";
import { runMatcher } from "./classes/matchingEngine";

import { WebSocketServer } from "ws";
import { handleOrderbookStream, handlePriceStream, handleTokenTradeStream } from "./services/websockets";
import { updateDailyBalance } from "./lib/dailyBalance";
import nodeCron from "node-cron";

process.on("uncaughtException", (error: Error) => {
  console.log(error, "uncaughtException shutting down the application");
  process.exit(1);
});

dotenv.config();

import app from "./app";

// ... other imports

// Create HTTP server
const server = http.createServer(app);

// We use { noServer: true } because we will manually handle the upgrade event
const wssPrice = new WebSocketServer({ noServer: true });
const wssOrderbook = new WebSocketServer({ noServer: true });
const wssTokenTrade = new WebSocketServer({ noServer: true });

// Handle HTTP upgrade requests for WebSockets
server.on("upgrade", function upgrade(request, socket, head) {
  const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;

  if (pathname === "/stream/price") {
    wssPrice.handleUpgrade(request, socket, head, function done(ws) {
      wssPrice.emit("connection", ws, request);
    });
  } else if (pathname === "/stream/orderbook") {
    wssOrderbook.handleUpgrade(request, socket, head, function done(ws) {
      wssOrderbook.emit("connection", ws, request);
    });
  } else if (pathname === "/stream/tokenTrade") {
    wssTokenTrade.handleUpgrade(request, socket, head, function done(ws) {
      wssTokenTrade.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

handlePriceStream(wssPrice);
handleOrderbookStream(wssOrderbook);
handleTokenTradeStream(wssTokenTrade);

const PORT = process.env.ORDER_SERVICE_PORT || 4002;

server.listen(PORT, () => {
  console.log("Order Server started on port", PORT);
  WSserver();
  orderBook();
  runMatcher();

  // ✅ Run daily balance cron job every day at midnight (UTC)
  nodeCron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running daily balance update...");
      await updateDailyBalance();
      console.log("Daily balance update completed.");
    } catch (error) {
      console.error("Error updating daily balances:", error);
    }
  });
});

process.on("unhandledRejection", (error: Error) => {
  console.log(error);
  console.log("unhandledRejection shutting down the application");
  process.exit(1);
});
