const express = require("express");
const usersController = require("../controllers/users.controller"); // Correct path
const router = express.Router();
const { body } = require("express-validator");

//sign up
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage(" Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  usersController.registerUser
);

//sign in
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("username is required"),
    body("password").notEmpty().withMessage("password is required"),
  ],
  usersController.loginUser
);
module.exports = router;
