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
      regionName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    // Array of strings for survival items
    survivalItems: {
      type: [String],
      default: [],
    },
    // People in need count
    peopleInNeed: {
      type: Number,
      default: 0,
    },
    // Organization information
    organization: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create an index for geospatial queries
SurveySchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("Survey", SurveySchema);
