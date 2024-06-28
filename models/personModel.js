const mongoose = require("mongoose");

// //1- create schema
const personSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,

    job: {
      type: String,
      required: [true, "required"],
    },

    adress: {
      type: String,
      required: [true, "required"],
    },

    relation: {
      type: String,
      required: [true, "required"],
    },

    phone: {
      type: Number,
      required: [true, "required"],
    },

    additionalInformation: {
      type: String,
      required: [true, "required"],
    },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/persons/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findone , findall and update
personSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
personSchema.post("save", (doc) => {
  setImageURL(doc);
});

const personModel = mongoose.model("persons", personSchema);

module.exports = personModel;
