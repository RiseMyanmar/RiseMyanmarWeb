const mongoose = require("mongoose");

const SurveySchema = new mongoose.Schema(
  {
    // Using GeoJSON for location (coordinates as [longitude, latitude])
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    money: {
      type: Number,
      required: true,
    },
    // Array of strings for survival items like meds, blanket, sleeping bag
    survivalItems: {
      type: [String],
      default: [],
    },
    water: {
      type: Number,
      required: true,
    },
    food: {
      type: Number,
      required: true,
    },
    clothes: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Create an index for geospatial queries
SurveySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Survey", SurveySchema);
