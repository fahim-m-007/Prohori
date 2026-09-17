const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true, trim: true, default: "Citizen" },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: {
      type: String,
      required: true,
      enum: [
        "Road accident",
        "Traffic disruption",
        "Waterlogging",
        "Theft",
        "Mugging",
        "Violence",
        "Hijacking",
        "Fire & Explosion",
        "Protest Blockade",
        "Other",
      ],
    },
    severity: {
      type: String,
      enum: ["high", "caution", "low", "resolved"],
      default: "caution",
    },
    thana: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    position: {
      type: [Number],
      default: [23.8103, 90.4125], // [lat, lng]
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["verified", "investigating", "resolved"],
      default: "verified",
    },
    reporterName: {
      type: String,
      trim: true,
      default: "Citizen Reporter",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    flagged: {
      type: Boolean,
      default: false,
    },
    flaggedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
