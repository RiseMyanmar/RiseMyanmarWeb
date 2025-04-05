const express = require("express");
const router = express.Router();
const Survey = require("./Survey");
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const survey = new Survey(req.body);
    await survey.save();
    res.status(201).json(survey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const surveys = await Survey.find({});
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
