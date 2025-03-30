const { validationResult } = require("express-validator");
const Todo = require("../models/todo");
const mongoose = require("mongoose");

exports.getAlltodos = async (req, res, next) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    next(err);
  }
};

exports.CreateTodo = async (req, res, next) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ message: "Text field is required." });
    }

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User information is missing." });
    }

    const newTodo = new Todo({
      text: req.body.text,
      completed: req.body.completed || false,
      userId: req.user._id,
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error("Error in CreateTodo:", err.message);
    next(err);
  }
};

exports.UpdatedTodos = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo || todo.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized or Todo not found" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedTodo);
  } catch (err) {
    next(err);
  }
};

exports.DeleteTodos = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo || todo.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized or Todo not found" });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    next(err);
  }
};
