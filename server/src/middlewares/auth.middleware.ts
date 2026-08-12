import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || "doctor-tracker-secret";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * Protect middleware to ensure the request has a valid Bearer JWT.
 */
export const protect = catchAsync(async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please login to get access.", 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired session token. Please login again.", 401));
  }
});

/**
 * Middleware guard to restrict access to specific user roles.
 */
export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
  };
};

export const adminGuard = restrictTo("admin");
