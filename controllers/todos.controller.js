const { validationResult } = require("express-validator");
const Todo = require("../models/todo"); // Import your Todo model
const mongoose = require("mongoose");
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Get all Todos
exports.getAlltodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a Todo
exports.CreateTodo = async (req, res) => {
  console.log(req.headers.authorization);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  console.log(req.user); // req.user should now be populated by the middleware
  const userId = req.user._id; // Access the _id from the decoded token

  const todo = new Todo({
    text: req.body.text,
    userId: userId, // Save the userId along with the todo
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.UpdatedTodos = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
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
};

exports.DeleteTodos = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
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
};
