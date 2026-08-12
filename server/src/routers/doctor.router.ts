import { Router } from "express";
import {
  getDoctors,
  createDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorPatients,
  createDoctorPatient,
  deleteDoctorPatient,
} from "../controllers/doctor.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createDoctorSchema,
  updateDoctorSchema,
} from "../validations/doctor.validation.js";
import { createPatientSchema } from "../validations/patient.validation.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getDoctors)
  .post(validate(createDoctorSchema), createDoctor);

router
  .route("/:id")
  .get(getDoctorById)
  .patch(validate(updateDoctorSchema), updateDoctor)
  .delete(deleteDoctor);

// Doctor-Patient relationship routes
router
  .route("/:doctorId/patients")
  .get(getDoctorPatients)
  .post(validate(createPatientSchema), createDoctorPatient);

router
  .route("/:doctorId/patients/:patientId")
  .delete(deleteDoctorPatient);

export default router;
