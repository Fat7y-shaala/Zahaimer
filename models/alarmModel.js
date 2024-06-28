const mongoose = require("mongoose");

//1- create schema
const alarmSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "required"],
    },
    
    time: {
      type: String,
      required: [true, "required"],
    },

    details: {
      type: String,
      required: [true, "required"],
    },
  },
  { timestamps: true }
);

//2- convert schema

module.exports = mongoose.model("alarm", alarmSchema);


