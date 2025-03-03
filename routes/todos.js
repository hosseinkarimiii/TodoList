// routes/todos.js
const express = require("express");
const router = express.Router();

// Add a basic route for now
router.get("/", (req, res) => {
  res.send("Todos API");
});

module.exports = router;
