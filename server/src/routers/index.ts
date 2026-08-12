import { Router } from "express";
import authRouter from "./auth.router.js";
import doctorRouter from "./doctor.router.js";
import patientRouter from "./patient.router.js";
import dashboardRouter from "./dashboard.router.js";

const apiRouter = Router();

// Health check ping
apiRouter.get("/ping", (_req, res) => {
  res.json({ status: "ok", message: "pong" });
});

// Mounted sub-routers
apiRouter.use("/auth", authRouter);
apiRouter.use("/doctors", doctorRouter);
apiRouter.use("/patients", patientRouter);
apiRouter.use("/dashboard", dashboardRouter);

export default apiRouter;
