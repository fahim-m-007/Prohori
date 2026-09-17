const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
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
      enum: ["high", "caution", "resolved", "low"],
      default: "caution",
    },
    thana: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    position: {
      type: [Number], // [latitude, longitude]
      default: [23.8103, 90.4125],
    },
    images: {
      type: [String],
      default: [],
    },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    flagged: { type: Boolean, default: false },
    flaggedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["verified", "pending", "resolved"],
      default: "verified",
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reporterName: { type: String, default: "Anonymous Commuter" },
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
