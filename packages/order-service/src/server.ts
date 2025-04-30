import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { globalErrorHandler, AppError, healthCheck } from "@paperdex/lib";

import orderRoutes from "./routes/ordersRoute";

process.on("uncaughtException", (error: Error) => {
    console.log(error, "uncaughtException shutting down the application");
    process.exit(1);
});

dotenv.config();

const app = express();

app.use(
    cors({
        origin: [process.env.NEXT_PUBLIC_CLIENT_SERVICE!],
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());

// To secure HTTP header & HTTP request logger middleware
app.use(helmet());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/v1/order", orderRoutes);

app.get("/api/v1/health", healthCheck("Order Service is up and running"));
app.all("*splat", (req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    next(err);
});

// Global Error Handling
app.use(globalErrorHandler);

const PORT = process.env.ORDER_SERVICE_PORT || 4002;
app.listen(PORT, () => {
    console.log("Order Server started on port", PORT);
});

process.on("unhandledRejection", (error: Error) => {
    console.log(error.name, error.message);
    console.log("unhandledRejection shutting down the application");
    process.exit(1);
});
