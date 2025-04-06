const path = require("path");
DEBUG = false;

if (DEBUG) {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
} else {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const surveyRoutes = require("./surveyRoutes");
const newsRoutes = require("./newsRoutes");
const cors = require("cors");
const cron = require("node-cron");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://risemyanmarweb.onrender.com",
      "http://localhost:3000",
      "http://localhost:8000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB using environment variables
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log("Connected to database:", mongoose.connection.name);
    console.log(
      "Connection string detected:",
      process.env.MONGODB_URI ? "Yes" : "No"
    );

    // Schedule news fetching once connected to DB
    // Schedule to run at midnight every day
    cron.schedule("0 0 * * *", async () => {
      console.log("🕛 Running scheduled news update...");
      try {
        await newsRoutes.fetchAndStoreNews();
        console.log("✅ Scheduled news update completed");
      } catch (error) {
        console.error("❌ Scheduled news update failed:", error);
      }
    });

    // Initial fetch on server start
    newsRoutes
      .fetchAndStoreNews()
      .then(() => console.log("✅ Initial news fetch completed"))
      .catch((err) => console.error("❌ Initial news fetch failed:", err));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.error("MongoDB URI available:", !!process.env.MONGODB_URI);
    if (process.env.MONGODB_URI) {
      console.log("URI format check: starts with mongodb+srv://");
    }
  });

// API routes
app.use("/api/surveys", surveyRoutes);
app.use("/api/news", newsRoutes);

// Add this temporary test route to server.js to debug
app.get("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

// Add this route handler for the root path near your other routes
app.get("/", (req, res) => {
  res.json({
    message: "Help Myanmar Rise API Server",
    endpoints: [
      {
        path: "/api/news",
        description: "Fetch news articles about Myanmar earthquake",
      },
      { path: "/api/surveys", description: "Access and submit survey data" },
      {
        path: "/test",
        description: "Test endpoint to verify server functionality",
      },
    ],
    status: "online",
  });
});

// Add this near your other routes (only in DEBUG mode)
if (DEBUG) {
  app.get("/debug/env", (req, res) => {
    res.json({
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      gnews_api_key_exists: !!process.env.REACT_APP_GNEWS_API_KEY,
      backend_port: process.env.BACKEND_PORT,
      env_path: path.resolve(__dirname, "../.env"),
    });
  });
}

if (DEBUG) {
  const PORT = process.env.BACKEND_PORT || 3000;
  app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
} else {
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
}
