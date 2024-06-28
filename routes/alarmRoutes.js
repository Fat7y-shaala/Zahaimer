const express = require("express");

const {
  getAlarmValidator,
  createAlarmValidator,
  updateAlarmValidator,
  deleteAlarmValidator,
} = require("../utils/validators/alarmValedator");
const {
  getAlarms,
  createAlarm,
  getAlarm,
  updateAlarm,
  deleteAlarm,
} = require("../services/alarmServices");

const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(AuthService.protect, AuthService.allowedTo("admin", "user"), getAlarms)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    createAlarmValidator,
    createAlarm
  );
router
  .route("/:id")
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    getAlarmValidator,
    getAlarm
  )
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    updateAlarmValidator,
    updateAlarm
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    deleteAlarmValidator,
    deleteAlarm
  );
module.exports = router;
