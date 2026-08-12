import cors from "cors";

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "http://localhost:5173",
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps, curl, or serverless internal requests)
    if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in case user hasn't set exact CLIENT_URL yet
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;
