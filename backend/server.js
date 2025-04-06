require("dotenv").config({ path: "../.env" });
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
  .catch((err) => console.error("MongoDB connection error:", err));

// API routes
app.use("/api/surveys", surveyRoutes);
app.use("/api/news", newsRoutes);

// Add this temporary test route to server.js to debug
app.get("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
