const express = require("express");
const TodoControllers = require("../controllers/todos.controller");
const { body, param } = require("express-validator"); // اضافه کردن اعتبارسنجی برای پارامترها
const router = express.Router();

// اعتبارسنجی‌های قابل استفاده مجدد برای فیلد text
const todoValidations = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Todo text cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Todo text cannot exceed 100 characters"), // محدودیت طول متن
];

// اعتبارسنجی برای id
const idValidation = [
  param("id").trim().isMongoId().withMessage("Invalid Todo ID"), // اعتبارسنجی برای فرمت MongoDB ObjectId
];

// دریافت همه Todos
// GET /api/todos
router.get("/", TodoControllers.getAlltodos);

// ایجاد یک Todo جدید
// POST /api/todos/create
router.post("/create", todoValidations, TodoControllers.CreateTodo);

// به‌روزرسانی یک Todo
// PATCH /api/todos/:id
router.patch(
  "/:id",
  [
    ...idValidation,
    body("text")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Text cannot be empty")
      .isLength({ max: 100 })
      .withMessage("Todo text cannot exceed 100 characters"), // محدودیت طول متن برای به‌روزرسانی
  ],
  TodoControllers.UpdatedTodos
);

// حذف یک Todo
// DELETE /api/todos/:id
router.delete("/:id", idValidation, TodoControllers.DeleteTodos);

module.exports = router;
