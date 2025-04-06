const express = require("express");
const router = express.Router();
const Survey = require("./Survey");
const mongoose = require("mongoose");

// Create or update a survey
router.post("/", async (req, res) => {
  try {
    console.log("Received survey data:", req.body);

    // Check if a survey with the same organization and location exists
    const existingSurvey = await Survey.findOne({
      "location.regionName": req.body.location.regionName,
    });

    let survey;

    if (existingSurvey) {
      // Update the existing survey
      console.log(
        `Updating existing survey for ${req.body.organization} at ${req.body.location.regionName}`
      );

      // Update all fields
      existingSurvey.survivalItems = req.body.survivalItems;
      existingSurvey.peopleInNeed = req.body.peopleInNeed;
      // Don't update organization or location as they're the matching criteria

      // Save the updated document
      survey = await existingSurvey.save();

      res.status(200).json({
        message: "Survey updated successfully",
        survey,
      });
    } else {
      // Create a new survey
      console.log(
        `Creating new survey for ${req.body.organization} at ${req.body.location.regionName}`
      );
      survey = new Survey(req.body);
      await survey.save();

      res.status(201).json({
        message: "Survey created successfully",
        survey,
      });
    }
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
