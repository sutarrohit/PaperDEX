import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

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

app.use((req, res, next) => {
    console.log("request headers========>", req.headers);
    next();
});

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(cookieParser());
app.use(express.json());

// To secure HTTP header
app.use(helmet());

// HTTP request logger middleware
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Auth Service is healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.AUTH_SERVICE_PORT || 4001;

app.listen(PORT, () => {
    console.log("Auth Server started on port", PORT);
});

process.on("unhandledRejection", (error: Error) => {
    console.log(error.name, error.message);
    console.log("unhandledRejection shutting down the application");
    process.exit(1);
});
