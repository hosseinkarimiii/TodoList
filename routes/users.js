const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

//sign up
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage(" Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
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
  }
);

//sign in
router.post(
  "/login",
  [
    body(username).notEmpty().withMessage("username is required"),
    body(password).notEmpty().withMessage("password is required"),
  ],
  async (req, res) => {
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

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.send({ token });
    } catch (error) {
      if (error.name === "Mongo Error") res.status(500).json("database error");
      else {
        res.status(500).send(error);
      }
    }
  }
);
module.exports = router;
