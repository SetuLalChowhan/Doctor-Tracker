import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getJwtSecret = (): string => {
  return (
    process.env.JWT_SECRET ||
    process.env.ACCESS_TOKEN_SECRET ||
    "doctor_tracker_jwt_secret_key_2026"
  );
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, getJwtSecret());
};
