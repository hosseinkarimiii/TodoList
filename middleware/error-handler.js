const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err);
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ message: "Validation error", errors: err.errors });
  }
  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(400).json({ message: "Duplicate key error" });
  }
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid or missing token" });
  }
  res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
