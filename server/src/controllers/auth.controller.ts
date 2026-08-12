import type { Response, NextFunction } from "express";
import { User } from "../models/user.model.js";
import { comparePassword, generateToken } from "../utils/auth.util.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const login = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user || !(await comparePassword(password, user.password || ""))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = generateToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  }
);

export const getMe = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  }
);

export const logout = catchAsync(
  async (_req: AuthenticatedRequest, res: Response) => {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  }
);
