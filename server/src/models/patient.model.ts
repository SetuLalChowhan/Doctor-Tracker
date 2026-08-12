import { Schema, model, Document, Types } from "mongoose";

export interface IPatient extends Document {
  doctorId: Types.ObjectId;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  condition: string;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "{VALUE} is not a supported gender",
      },
      required: [true, "Gender is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    condition: {
      type: String,
      required: [true, "Patient condition is required"],
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast relational lookup and date-based analytics
patientSchema.index({ doctorId: 1, createdAt: -1 });
patientSchema.index({ createdAt: -1 });

export const Patient = model<IPatient>("Patient", patientSchema);
export default Patient;
