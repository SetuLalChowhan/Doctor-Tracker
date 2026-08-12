import type { Request, Response } from "express";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { catchAsync } from "../utils/catchAsync.js";

/**
 * GET /api/v1/dashboard/stats
 * Admin dashboard analytics data
 */
export const getDashboardStats = catchAsync(
  async (_req: Request, res: Response) => {
    const [totalDoctors, totalPatients] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
    ]);

    // Aggregate Patients Per Doctor
    const patientsPerDoctor = await Patient.aggregate([
      {
        $group: {
          _id: "$doctorId",
          patientCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $unwind: {
          path: "$doctor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          doctorId: "$_id",
          doctorName: { $ifNull: ["$doctor.name", "Unknown Doctor"] },
          specialization: { $ifNull: ["$doctor.specialization", "General"] },
          hospital: { $ifNull: ["$doctor.hospital", "N/A"] },
          patientCount: 1,
        },
      },
      { $sort: { patientCount: -1 } },
    ]);

    // Aggregate Date-based patient registration statistics (last 7 days/months)
    const dateBasedStats = await Patient.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
    ]);

    // Condition distribution for visual charts
    const conditionStats = await Patient.aggregate([
      {
        $group: {
          _id: "$condition",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          condition: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalDoctors,
        totalPatients,
        patientsPerDoctor,
        dateBasedStats,
        conditionStats,
      },
    });
  }
);
