const express = require("express");
const AuthService = require("../services/authService");

const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} = require("../services/noteService");

const {
  createNoteValidator,
  getNoteValidator,
  updateNoteValidator,
  deleteNoteValidator,
} = require("../utils/validators/noteValedator");

// merge params allow us to access parameters on other routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    createNoteValidator,
    createNote
  )
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    getNotes
  );
router
  .route("/:id")
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    getNoteValidator,
    getNote
  )
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    updateNoteValidator,
    updateNote
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "user"),
    deleteNoteValidator,
    deleteNote
  );
module.exports = router;
