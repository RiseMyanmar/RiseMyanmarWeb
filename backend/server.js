const express = require("express");
const mongoose = require("mongoose");
const surveyRoutes = require("./surveyRoutes");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB (update the connection string as needed)
mongoose
  .connect(
    "mongodb+srv://PhyoTh:Patrick9@helpmyanmarrise.jzgcbx6.mongodb.net/help-myanmar-rise?retryWrites=true&w=majority&appName=HelpMyanmarRise",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
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
