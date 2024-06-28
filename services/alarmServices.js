const factory = require("./handlerFactor");

const alarm = require("../models/alarmModel");

//@desc   get list of alarms
//@route   get /api/v1/alarms
//@access  public
exports.getAlarms = factory.getAll(alarm);

//@desc   get specific alarm by id
//@route   get /api/v1/alarms/id:
//@access  public
exports.getAlarm = factory.getOne(alarm);

//@desc   create alarm
//@route   post /api/v1/alarms
//@access  private
exports.createAlarm = factory.createOne(alarm);

//@desc   update specific alarm
//@route   put /api/v1/alarms/id:
//@access  private
exports.updateAlarm = factory.updateOne(alarm);

//@desc   delete specific alarm
//@route   delete /api/v1/alarms/id:
//@access  private
exports.deleteAlarm = factory.deleteOne(alarm);
