const jwt = require("jsonwebtoken");
const { expressjwt: expressJwt } = require("express-jwt");

// Middleware to handle JWT errors (optional, for cleaner error handling)
const handleJwtError = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid or missing token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  next(err); // انتقال سایر خطاها به middleware مدیریت خطا
};

// Utility to generate JWT tokens
const generateToken = (payload, expiresIn = "1h") => {
  if (!process.env.JWT) {
    throw new Error("JWT secret is not defined in environment variables");
  }
  return jwt.sign(payload, process.env.JWT, { expiresIn });
};

// Utility to verify and decode JWT tokens manually (Optional)
const verifyAndDecodeToken = (token) => {
  try {
    if (!process.env.JWT) {
      throw new Error("JWT secret is not defined in environment variables");
    }
    return jwt.verify(token, process.env.JWT);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    throw err;
  }
};

module.exports = {
  handleJwtError,
  generateToken,
  verifyAndDecodeToken,
};
