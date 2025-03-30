const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "User registered!" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({ message: "Username already exists." });
    } else {
      next(error);
    }
  }
};

exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
