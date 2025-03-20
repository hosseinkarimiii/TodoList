const express = require("express");
const TodoControllers = require("../controllers/todos.controller");
const { body } = require("express-validator");
const router = express.Router();
//Get All Todos
router.get("/", TodoControllers.getAlltodos);
//CreateTodos
router.post(
  "/",
  [body("text").notEmpty().withMessage("Text is required")],
  TodoControllers.CreateTodo
);
// Update a Todos
router.patch(
  "/:id",
  [body("text").optional().notEmpty().withMessage("Text cannot be empty")],
  TodoControllers.UpdatedTodos
);
// Delete a todo
router.delete("/:id", TodoControllers.DeleteTodos);

// Export the router, not just the model
module.exports = router;
