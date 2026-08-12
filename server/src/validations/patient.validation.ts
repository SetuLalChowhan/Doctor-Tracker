import { z } from "zod";

export const createPatientSchema = z.object({
  body: z.object({
    doctorId: z.string().optional(),
    name: z.string().min(2, "Patient name must be at least 2 characters"),
    age: z.number().min(0, "Age must be a positive number"),
    gender: z.enum(["Male", "Female", "Other"]),
    phone: z.string().min(3, "Phone number is required"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    condition: z.string().min(2, "Condition is required"),
  }),
});

export const updatePatientSchema = z.object({
  body: z.object({
    doctorId: z.string().optional(),
    name: z.string().min(2).optional(),
    age: z.number().min(0).optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    phone: z.string().min(5).optional(),
    email: z.string().email().optional().or(z.literal("")),
    condition: z.string().min(2).optional(),
  }),
});
