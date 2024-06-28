const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const factory = require("./handlerFactor");
const { uploadSingleImage } = require("../middleWares/uploadImageMiddleware");
const personModel = require("../models/personModel");

// upload single image
exports.uploadPersonImage = uploadSingleImage("image");

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `person-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(400, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/persons/${filename}`);

    // save image to db
    req.body.image = filename;
  }

  next();
});

//@desc   get list of persons
//@route   get /api/v1/persons
//@access  public
exports.getPersons = factory.getAll(personModel);

//@desc   get specific person by id
//@route   get /api/v1/persons/id:
//@access  public
exports.getPerson = factory.getOne(personModel);

//@desc   create person
//@route   post /api/v1/persons
//@access  private
exports.createPerson = factory.createOne(personModel);

//@desc   update specific person
//@route   put /api/v1/persons/id:
//@access  private
exports.updatePerson = factory.updateOne(personModel);

//@desc   delete specific person
//@route   delete /api/v1/persons/id:
//@access  private
exports.deletePerson = factory.deleteOne(personModel);
