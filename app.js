// Import necessary modules
const express = require("express");
const mongoose = require("mongoose"); // Import the Mongoose ODM for MongoDB
const dotenv = require("dotenv"); // Import module for loading environment variables
const todoRoutes = require("./routes/todos"); // Import route definitions for the Todo API
const userRoutes = require("./routes/users"); //import route definitions for User Authentication.
const { expressjwt: jwt } = require("express-jwt"); // import JWT for identify personally user
// Load environment variables from .env file
dotenv.config();

const app = express();

// Set the port number for the server
const PORT = process.env.PORT || 3000; // Use the PORT environment variable if set, otherwise default to 3000

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGODB_URI) // Use the MONGODB_URI environment variable for the connection string
  .then(() => console.log("MongoDB Connected")) // Log a success message if the connection is successful
  .catch((err) => console.error("MongoDB Connection Error:", err)); // Log an error message if the connection fails.

// Use the body-parser middleware to parse JSON request bodies
app.use(express.json());

// Mount the todoRoutes middleware at the '/todos' path
app.use(
  "/todos",
  jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  todoRoutes
); // This means any requests to paths starting with '/todos' will be handled by todoRoutes
app.use("/users", userRoutes);

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
