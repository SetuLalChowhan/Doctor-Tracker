import { z } from "zod";

export const createDoctorSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Doctor name must be at least 2 characters"),
    specialization: z.string().min(2, "Specialization is required"),
    hospital: z.string().min(2, "Hospital is required"),
    phone: z.string().min(5, "Phone number is required"),
    email: z.string().email("Invalid email address"),
  }),
});

export const updateDoctorSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    specialization: z.string().min(2).optional(),
    hospital: z.string().min(2).optional(),
    phone: z.string().min(5).optional(),
    email: z.string().email().optional(),
  }),
});
