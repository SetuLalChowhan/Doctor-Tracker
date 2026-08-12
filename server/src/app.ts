import express from "express";
import cookieParser from "cookie-parser";
import corsMiddleware from "./middlewares/cors.middleware.js";
import apiRouter from "./routers/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { AppError } from "./utils/AppError.js";

const app = express();

// Core Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root Health Check
app.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "Doctor Tracker API Server is running",
  });
});

// API Routes
app.use("/api/v1", apiRouter);

// 404 Handler
app.use((req, _res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global Error Handler
app.use(errorMiddleware);

export { app };
export default app;
