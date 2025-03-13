//User Authentication.
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 8;
  const user = this;
  if (user.isModified("password"))
    try {
      user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
    } catch (error) {
      return next(error);
    }

  next();
});
module.exports = mongoose.model("User", userSchema);
