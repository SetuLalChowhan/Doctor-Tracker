import type { Request, Response, NextFunction } from "express";
import { Patient } from "../models/patient.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

/**
 * GET /api/v1/patients
 * List all patients with search, condition filter, doctor filter, and pagination
 */
export const getPatients = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const { search, condition, doctorId, gender, startDate, endDate } = req.query;

  const queryFilter: any = {};

  if (search) {
    const searchRegex = new RegExp(search as string, "i");
    queryFilter.$or = [
      { name: searchRegex },
      { condition: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
    ];
  }

  if (condition) {
    queryFilter.condition = new RegExp(condition as string, "i");
  }

  if (doctorId) {
    queryFilter.doctorId = doctorId;
  }

  if (gender) {
    queryFilter.gender = gender;
  }

  if (startDate || endDate) {
    queryFilter.createdAt = {};
    if (startDate) queryFilter.createdAt.$gte = new Date(startDate as string);
    if (endDate) queryFilter.createdAt.$lte = new Date(endDate as string);
  }

  const [patients, total] = await Promise.all([
    Patient.find(queryFilter)
      .populate("doctorId", "name specialization hospital email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Patient.countDocuments(queryFilter),
  ]);

  res.status(200).json({
    status: "success",
    results: patients.length,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
    data: {
      patients,
    },
  });
});

/**
 * GET /api/v1/patients/:id
 * Get single patient details
 */
export const getPatientById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const patient = await Patient.findById(req.params.id)
      .populate("doctorId", "name specialization hospital phone email")
      .lean();

    if (!patient) {
      return next(new AppError("Patient not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        patient,
      },
    });
  }
);

/**
 * PATCH /api/v1/patients/:id
 * Edit patient information
 */
export const updatePatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("doctorId", "name specialization hospital");

    if (!patient) {
      return next(new AppError("Patient not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        patient,
      },
    });
  }
);

/**
 * DELETE /api/v1/patients/:id
 * Delete patient
 */
export const deletePatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return next(new AppError("Patient not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Patient deleted successfully",
    });
  }
);
