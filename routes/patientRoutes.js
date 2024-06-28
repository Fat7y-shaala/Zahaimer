const express = require("express");

const {
  getPatientValidator,
  createPatientValidator,
  updatePatientValidator,
  deletePatientValidator,
} = require("../utils/validators/patientValidator");
const {
  getPatients,
  createPatient,
  getPatient,
  updatePatient,
  deletePatient,
} = require("../services/patientService");

const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(AuthService.protect, AuthService.allowedTo("admin", "user"), getPatients)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    createPatientValidator,
    createPatient
  );
router
  .route("/:id")
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    getPatientValidator,
    getPatient
  )
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    updatePatientValidator,
    updatePatient
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    deletePatientValidator,
    deletePatient
  );
module.exports = router;
