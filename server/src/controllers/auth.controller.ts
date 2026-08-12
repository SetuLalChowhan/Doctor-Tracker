import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";

export const login = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.json({ status: "success", message: "Auth endpoint placeholder" });
  }
);
