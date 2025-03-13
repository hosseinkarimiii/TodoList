const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Todo = require("../models/todo"); // Import your Todo model
const mongoose = require("mongoose");
const isValidonjectID = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
// Get all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a todo
router.post(
  "/",
  [body("text").notEmpty().withMessage("Text is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const todo = new Todo({
      text: req.body.text,
    });

    try {
      const newTodo = await todo.save();
      res.status(201).json(newTodo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Update a todo
router.patch(
  "/:id",
  [body("text").optional().notEmpty().withMessage("Text cannot be empty")],
  async (req, res) => {
    if (!isValidonjectID(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const todo = await Todo.findById(req.params.id);
      if (todo == null) {
        return res.status(404).json({ message: "Cannot find todo" });
      }
      if (req.body.text != null) {
        todo.text = req.body.text;
      }
      if (req.body.completed != null) {
        todo.completed = req.body.completed;
      }
      const updatedTodo = await todo.save();
      res.json(updatedTodo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Delete a todo
router.delete("/:id", async (req, res) => {
  if (!isValidonjectID(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: "Cannot find todo" });
    }
    res.json({ message: "Deleted Todo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export the router, not just the model
module.exports = router;
