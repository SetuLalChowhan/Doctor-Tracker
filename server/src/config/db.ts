import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const connString =
      process.env.MONGODB_URI ||
      process.env.DATABASE_URL ||
      "mongodb://127.0.0.1:27017/doctorTracker";

    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host} 🍃`);
  } catch (error: any) {
    console.error("MongoDB Connection Warning ⚠️:", error.message || error);
    console.log("Server will continue running; health endpoint will reflect DB status.");
  }
};

export default connectDB;