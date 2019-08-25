const { Schema, model } = require("mongoose");
const regex = require("../utils/regex");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: regex.email
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("User", userSchema);
