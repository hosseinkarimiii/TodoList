const express = require("express");
const { expressjwt: expressJwt } = require("express-jwt");

const mongoose = require("mongoose");
require("dotenv").config();
const todoRoutes = require("./routes/todos");
const userRoutes = require("./routes/users");
const { handleJwtError } = require("./middleware/auth");
const errorHandler = require("./middleware/error-handler");

const app = express();
const PORT = process.env.PORT || 3000;

// اتصال به دیتابیس
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middleware برای پردازش JSON
app.use(express.json());

// Middleware برای احراز هویت
const verifyToken = expressJwt({
  secret: process.env.JWT,
  algorithms: ["HS256"],
  requestProperty: "auth", // Decoded token will be stored in req.auth
}).unless({
  path: ["/api/users/login", "/api/users/register"], // مسیرهای مستثنی
});
app.use(verifyToken); // اعمال احراز هویت

// Middleware برای تبدیل req.auth به req.user
app.use((req, res, next) => {
  if (req.auth) {
    req.user = { _id: req.auth._id }; // Transfer decoded ID to req.user
    console.log("Decoded user info:", req.user);
  }
  next();
});

// مدیریت خطاهای مربوط به JWT
app.use(handleJwtError);

// مسیرهای مربوط به Todo و User
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

// Middleware مدیریت خطا
app.use(errorHandler);

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
