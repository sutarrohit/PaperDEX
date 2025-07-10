/* eslint-disable @typescript-eslint/no-unused-vars */
import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { globalErrorHandler, AppError, healthCheck } from "@paperdex/lib";
import { WSserver } from "./services/price-service";

import orderRoutes from "./routes/ordersRoute";
import tokenRoutes from "./routes/tokenRoutes";
import { orderBook } from "./services/price-service/orderBook";
import { runMatcher } from "./classes/matchingEngine";

import { WebSocketServer } from "ws";
import { handleOrderbookStream, handlePriceStream, handleTokenTradeStream } from "./services/websockets";
import userRoutes from "./routes/userRoutes";

process.on("uncaughtException", (error: Error) => {
  console.log(error, "uncaughtException shutting down the application");
  process.exit(1);
});

dotenv.config();

const app = express();

console.log("test2");

app.use(
  cors({
    origin: [process.env.NEXT_PUBLIC_CLIENT_SERVICE!],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

// To secure HTTP header & HTTP request logger middleware
app.use(helmet());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/token", tokenRoutes);
app.use("/api/v1/user", userRoutes);

app.get("/api/v1/health", healthCheck("Order Service is up and running"));
app.all("*splat", (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

// Global Error Handling
app.use(globalErrorHandler);

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
});

process.on("unhandledRejection", (error: Error) => {
  console.log(error);
  console.log("unhandledRejection shutting down the application");
  process.exit(1);
});
