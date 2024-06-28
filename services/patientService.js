
const patient = require("../models/patientModel");
const factory = require("./handlerFactor");

//@desc   get list of patients
//@route   get /api/v1/patients
//@access  public
exports.getPatients = factory.getAll(patient );



//@desc   get specific patient by id
//@route   get /api/v1/patients/id:
//@access  public
exports.getPatient = factory.getOne(patient);



//@desc   create patient
//@route   post /api/v1/patients
//@access  private
exports.createPatient = factory.createOne(patient);

//@desc   update specific patient
//@route   put /api/v1/patients/id:
//@access  private
exports.updatePatient = factory.updateOne(patient);

//@desc   delete specific patient
//@route   delete /api/v1/patients/id:
//@access  private
exports.deletePatient = factory.deleteOne(patient);


















