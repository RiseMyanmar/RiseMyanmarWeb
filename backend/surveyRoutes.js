const express = require("express");
const router = express.Router();
const Survey = require("./Survey");
const mongoose = require("mongoose");

// Create a new survey
router.post("/", async (req, res) => {
  try {
    console.log("Received survey data:", req.body);
    const survey = new Survey(req.body);
    await survey.save();
    res.status(201).json(survey);
  } catch (error) {
    console.error("Error saving survey:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get all surveys
router.get("/", async (req, res) => {
  try {
    const surveys = await Survey.find({});
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get surveys by region
router.get("/region/:regionName", async (req, res) => {
  try {
    const regionName = req.params.regionName;
    const surveys = await Survey.find({ "location.regionName": regionName });
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get surveys near a location
router.get("/near", async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters, default 10km

    if (!longitude || !latitude) {
      return res
        .status(400)
        .json({ message: "Longitude and latitude are required" });
    }

    const surveys = await Survey.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });

    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get surveys by organization
router.get("/organization/:orgName", async (req, res) => {
  try {
    const orgName = req.params.orgName;
    const surveys = await Survey.find({
      organization: { $regex: new RegExp(orgName, "i") },
    });
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
