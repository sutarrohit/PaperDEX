import express, { Express } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { globalErrorHandler, AppError, healthCheck } from "@paperdex/lib";
import orderRoutes from "./routes/ordersRoute";
import tokenRoutes from "./routes/tokenRoutes";
import userRoutes from "./routes/userRoutes";

const app: Express = express();

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

export default app;
