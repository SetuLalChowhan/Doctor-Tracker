import { Router } from "express";
import authRouter from "./auth.router.js";

const apiRouter = Router();

// Health check ping
apiRouter.get("/ping", (_req, res) => {
  res.json({ status: "ok", message: "pong" });
});

// Authentication routes
apiRouter.use("/auth", authRouter);

export default apiRouter;
