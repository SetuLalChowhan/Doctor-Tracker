import { Express } from "express";
import mongoose from "mongoose";
import connectDB from "../config/db.js";

const PORT = process.env.PORT || 5000;

export async function startApp(app: Express) {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start Express HTTP server listener
    const server = app.listen(PORT, () => {
      console.log(
        `Server running → http://localhost:${PORT} in ${
          process.env.NODE_ENV || "development"
        } mode 🚀`
      );
    });

    // 3. Handle unhandled promise rejections globally
    process.on("unhandledRejection", (err: any) => {
      console.error("UNHANDLED REJECTION! 💥 Shutting down gracefully...");
      console.error(err?.name, err?.message, err?.stack);
      server.close(() => {
        process.exit(1);
      });
    });

    // 4. Graceful shutdown on SIGTERM / SIGINT signals
    const handleShutdown = (signal: string) => {
      console.log(`${signal} received. Closing HTTP server gracefully...`);
      server.close(async () => {
        await mongoose.connection.close();
        console.log("DB connections disconnected. Process terminated.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGINT", () => handleShutdown("SIGINT"));

    return server;
  } catch (error) {
    console.error("Failed to initialize server connection:", error);
    process.exit(1);
  }
}
