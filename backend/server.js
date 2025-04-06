require("dotenv").config({ path: "../.env" });
const express = require("express");
const mongoose = require("mongoose");
const surveyRoutes = require("./surveyRoutes");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    // Allow connections from any origin in development
    origin: "*", // For development only - restrict this in production
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB using environment variables
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    console.log("Connected to database:", mongoose.connection.name);
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// API route to handle surveys
app.use("/api/surveys", surveyRoutes);

// Add this temporary test route to server.js to debug
app.get("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
