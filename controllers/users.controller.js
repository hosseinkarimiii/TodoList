const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.registerUser = async (req, res) => {
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
      res.status(400).send(error);
    }
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.send({ token });
  } catch (error) {
    if (error.name === "Mongo Error") res.status(500).json("database error");
    else {
      res.status(500).send(error);
    }
  }
};
