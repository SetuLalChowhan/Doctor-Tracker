import { Schema, model, Document } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
      index: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      index: true,
    },
    hospital: {
      type: String,
      required: [true, "Hospital is required"],
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimized searching, filtering, and date-wise sorting
doctorSchema.index({ createdAt: -1 });
doctorSchema.index({ name: 1, specialization: 1, hospital: 1 });

export const Doctor = model<IDoctor>("Doctor", doctorSchema);
export default Doctor;
