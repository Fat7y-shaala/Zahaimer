const express = require("express");


const {
  getPersonValidator,
  createPersonValidator,
  updatePersonValidator,
  deletePersonValidator,
} = require("../utils/validators/personValedator");
const {
  getPersons,
  createPerson,
  getPerson,
  updatePerson,
  deletePerson,
  uploadPersonImage,
  resizeImage,
} = require("../services/personservices");

const AuthService = require("../services/authService");

const router = express.Router();


router
  .route("/")
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    getPersons
  )
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    uploadPersonImage,
    resizeImage,
    createPersonValidator,
    createPerson
  );

//router.post("/login",login);

router
  .route("/:id")
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    getPersonValidator,
    getPerson
  )
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    uploadPersonImage,
    resizeImage,
    updatePersonValidator,
    updatePerson
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    deletePersonValidator,
    deletePerson
  );

module.exports = router;
