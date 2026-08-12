import mongoose from "mongoose";
import dns from "dns";

// Fix Node.js SRV lookup failure (querySrv ECONNREFUSED) on Windows DNS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch { }

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/doctorTracker";
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected 🍃");
  } catch (error: any) {
    console.error("DB Error:", error?.message || error);
  }
};

export default connectDB;