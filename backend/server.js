require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const surveyRoutes = require("./surveyRoutes");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB using environment variables
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API route to handle surveys
app.use("/api/surveys", surveyRoutes);

// Add this temporary test route to server.js to debug
app.get("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
