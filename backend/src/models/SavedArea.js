const mongoose = require("mongoose");

const savedAreaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      enum: ["residential", "work", "campus", "family", "other"],
      default: "residential",
    },
    thana: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    position: {
      type: [Number],
      default: [23.8103, 90.4125], // [lat, lng]
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SavedArea", savedAreaSchema);
