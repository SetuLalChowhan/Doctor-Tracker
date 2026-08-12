import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth.util.js";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const protect = catchAsync(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please login to get access.", 401)
      );
    }

    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return next(
        new AppError("Invalid or expired session token. Please login again.", 401)
      );
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};

export const adminGuard = restrictTo("admin");
