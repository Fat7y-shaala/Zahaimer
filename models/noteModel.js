const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, " required "],
      minlenght: [10, "too short"],
      maxlenght: [100, "too long "],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    content: {
      type: String,
      require: [true, " required "],
      minlenght: [10, "too short"],
      maxlenght: [150, "too long "],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("note", noteSchema);
