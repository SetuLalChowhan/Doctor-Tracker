import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import corsMiddleware from "./middlewares/cors.middleware.js";
import apiRouter from "./routers/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { AppError } from "./utils/AppError.js";

const app = express();

// ── Core Middleware ───────────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Health Check Endpoints ───────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Doctor Tracker API Server running",
  });
});

app.get("/api/v1/health", (_req, res) => {
  const dbStatusMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.json({
    status: "ok",
    dbStatus: dbStatusMap[mongoose.connection.readyState] || "unknown",
    timestamp: new Date().toISOString(),
  });
});

// ── Consolidated API Routes (v1) ──────────────────────────────────────────────
app.use("/api/v1", apiRouter);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorMiddleware);

export { app };
export default app;
