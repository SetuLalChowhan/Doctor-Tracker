import { Express } from "express";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import { runSeeds } from "../seeds/index.js";

const PORT = process.env.PORT || 5000;

export async function startApp(app: Express) {
  try {
    await connectDB();

    if (mongoose.connection.readyState === 1) {
      await runSeeds();
    }

    const server = app.listen(PORT, () => {
      console.log(
        `Server running → http://localhost:${PORT} in ${
          process.env.NODE_ENV || "development"
        } mode 🚀`
      );
    });

    const shutdown = (signal: string) => {
      console.log(`${signal} received. Closing HTTP server...`);
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    return server;
  } catch (error) {
    console.error("Failed to start server connection:", error);
    process.exit(1);
  }
}
