import type { Request, Response, NextFunction } from "express";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

/**
 * GET /api/v1/doctors
 * Search, filter, and paginate doctors
 */
export const getDoctors = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const { search, specialization, hospital, startDate, endDate } = req.query;

  const queryFilter: any = {};

  if (search) {
    const searchRegex = new RegExp(search as string, "i");
    queryFilter.$or = [
      { name: searchRegex },
      { specialization: searchRegex },
      { hospital: searchRegex },
      { email: searchRegex },
    ];
  }

  if (specialization) {
    queryFilter.specialization = new RegExp(specialization as string, "i");
  }

  if (hospital) {
    queryFilter.hospital = new RegExp(hospital as string, "i");
  }

  if (startDate || endDate) {
    queryFilter.createdAt = {};
    if (startDate) queryFilter.createdAt.$gte = new Date(startDate as string);
    if (endDate) queryFilter.createdAt.$lte = new Date(endDate as string);
  }

  const [doctors, total] = await Promise.all([
    Doctor.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Doctor.countDocuments(queryFilter),
  ]);

  // Aggregate patient counts for returned doctors
  const doctorIds = doctors.map((d) => d._id);
  const patientCounts = await Patient.aggregate([
    { $match: { doctorId: { $in: doctorIds } } },
    { $group: { _id: "$doctorId", count: { $sum: 1 } } },
  ]);

  const countMap = new Map(
    patientCounts.map((item) => [item._id.toString(), item.count])
  );

  const enrichedDoctors = doctors.map((doc) => ({
    ...doc,
    patientCount: countMap.get(doc._id.toString()) || 0,
  }));

  res.status(200).json({
    status: "success",
    results: enrichedDoctors.length,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
    data: {
      doctors: enrichedDoctors,
    },
  });
});

/**
 * GET /api/v1/doctors/meta/options
 * Returns distinct specializations and hospitals available in the database
 */
export const getDoctorMetaOptions = catchAsync(
  async (_req: Request, res: Response) => {
    const [dbSpecializations, dbHospitals] = await Promise.all([
      Doctor.distinct("specialization"),
      Doctor.distinct("hospital"),
    ]);

    const defaultSpecializations = [
      "Cardiology",
      "Neurology",
      "Pediatrics",
      "Orthopedics",
      "General Medicine",
      "Dermatology",
      "Oncology",
      "Psychiatry",
    ];

    const defaultHospitals = [
      "Metro Health Hospital",
      "St. Jude Medical Center",
      "City Children's Hospital",
      "General Memorial Hospital",
    ];

    // Merge and deduplicate
    const specializations = Array.from(
      new Set([...defaultSpecializations, ...dbSpecializations.filter(Boolean)])
    ).sort();
    const hospitals = Array.from(
      new Set([...defaultHospitals, ...dbHospitals.filter(Boolean)])
    ).sort();

    res.status(200).json({
      status: "success",
      data: {
        specializations,
        hospitals,
      },
    });
  }
);

/**
 * POST /api/v1/doctors
 * Create a new doctor
 */
export const createDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (email) {
    const existing = await Doctor.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return next(new AppError("A doctor with this email address already exists.", 400));
    }
  }

  const doctor = await Doctor.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      doctor,
    },
  });
});

/**
 * GET /api/v1/doctors/:id
 * Get single doctor by ID
 */
export const getDoctorById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctor = await Doctor.findById(req.params.id).lean();
    if (!doctor) {
      return next(new AppError("Doctor not found", 404));
    }

    const patientCount = await Patient.countDocuments({ doctorId: doctor._id });

    res.status(200).json({
      status: "success",
      data: {
        doctor: {
          ...doctor,
          patientCount,
        },
      },
    });
  }
);

/**
 * PATCH /api/v1/doctors/:id
 * Update doctor details
 */
export const updateDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return next(new AppError("Doctor not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doctor,
      },
    });
  }
);

/**
 * DELETE /api/v1/doctors/:id
 * Delete doctor and associated patients
 */
export const deleteDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return next(new AppError("Doctor not found", 404));
    }

    // Delete associated patients
    await Patient.deleteMany({ doctorId: doctor._id });

    res.status(200).json({
      status: "success",
      message: "Doctor and associated patients deleted successfully",
    });
  }
);

/**
 * GET /api/v1/doctors/:doctorId/patients
 * View patients for a specific doctor
 */
export const getDoctorPatients = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return next(new AppError("Doctor not found", 404));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { search, condition, gender } = req.query;

    const queryFilter: any = { doctorId: doctor._id };

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

    if (gender) {
      queryFilter.gender = gender;
    }

    const [patients, total] = await Promise.all([
      Patient.find(queryFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Patient.countDocuments(queryFilter),
    ]);

    res.status(200).json({
      status: "success",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
      },
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
  }
);

/**
 * POST /api/v1/doctors/:doctorId/patients
 * Add a new patient under a specific doctor
 */
export const createDoctorPatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return next(new AppError("Doctor not found", 404));
    }

    const patient = await Patient.create({
      ...req.body,
      doctorId: doctor._id,
    });

    res.status(201).json({
      status: "success",
      data: {
        patient,
      },
    });
  }
);

/**
 * DELETE /api/v1/doctors/:doctorId/patients/:patientId
 * Delete patient from a doctor's patient list
 */
export const deleteDoctorPatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const patient = await Patient.findOneAndDelete({
      _id: req.params.patientId,
      doctorId: req.params.doctorId,
    });

    if (!patient) {
      return next(new AppError("Patient not found under this doctor", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Patient removed successfully",
    });
  }
);
