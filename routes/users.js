const express = require("express");
const usersController = require("../controllers/users.controller");
const { body } = require("express-validator");
const router = express.Router();

// اعتبارسنجی ورودی‌ها
const userValidations = {
  username: body("username")
    .trim() // حذف فاصله‌های اضافی
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric")
    .notEmpty()
    .withMessage("Username is required"),
  password: body("password")
    .trim() // حذف فاصله‌های اضافی
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .notEmpty()
    .withMessage("Password is required"),
};

// مسیر ثبت‌نام
// POST /api/users/register
router.post(
  "/register",
  [userValidations.username, userValidations.password],
  usersController.registerUser
);

// مسیر ورود
// POST /api/users/login
router.post(
  "/login",
  [userValidations.username, userValidations.password],
  usersController.loginUser
);

module.exports = router;
