import { Router } from "express";
import {
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updatePatientSchema } from "../validations/patient.validation.js";

const router = Router();

router.use(protect);

router.route("/").get(getPatients);

router
  .route("/:id")
  .get(getPatientById)
  .patch(validate(updatePatientSchema), updatePatient)
  .delete(deletePatient);

export default router;
