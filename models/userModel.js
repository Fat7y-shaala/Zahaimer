const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    partner_name: {
      type: String,
      trim: true,
      require: [true, "required"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    email: {
      type: String,
      require: [true, "required"],
      unique: [true, "must be unique"],
      lowercase: true,
    },

    age: String,
    profileImg: String,

    password: {
      type: String,
      require: [true, "password required"],
      minlenght: [6, "too short password"],
    },

    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// eslint-disable-next-line func-names
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //Hashing password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const user = mongoose.model("user", userSchema);
module.exports = user;
