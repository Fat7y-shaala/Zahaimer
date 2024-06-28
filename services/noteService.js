
const note = require("../models/noteModel");
const factory = require("./handlerFactor");


//@desc   create note
//@route   post /api/v1/notes
//@access  private
exports.createNote = factory.createOne(note);

//@desc   get list of notes
//@route   get /api/v1/notes
//@access  public
exports.getNotes = factory.getAll(note);

//@desc   get specific note by id
//@route   get /api/v1/notes/id:
//@access  public
exports.getNote = factory.getOne(note);

//@desc   update specific note
//@route   put /api/v1/notes/id:
//@access  private
exports.updateNote = factory.updateOne(note);

//@desc   delete specific note
//@route   delete /api/v1/notes/id:
//@access  private
exports.deleteNote = factory.deleteOne(note);










