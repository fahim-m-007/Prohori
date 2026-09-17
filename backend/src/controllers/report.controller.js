const mongoose = require("mongoose");
const Report = require("../models/Report");

// Approximate Dhaka Thana coordinate centroids for fallbacks
const thanaCoordinates = {
  "Dhanmondi": [23.7465, 90.3742],
  "Mirpur Model": [23.8067, 90.3688],
  "Shahbag": [23.7381, 90.3956],
  "Shahbagh": [23.7381, 90.3956],
  "Mohammadpur": [23.7512, 90.3578],
  "Gulshan": [23.7945, 90.4149],
  "Banani": [23.7937, 90.4046],
  "Uttara East": [23.8728, 90.3984],
  "Uttara West": [23.8752, 90.3842],
  "Badda": [23.7806, 90.4267],
  "Tejgaon": [23.7598, 90.3912],
  "Tejgaon Industrial Area": [23.7662, 90.4043],
  "Motijheel": [23.7334, 90.4178],
  "New Market": [23.7335, 90.3842],
  "Khilgaon": [23.7505, 90.4347],
  "Rampura": [23.7612, 90.4208],
  "Hatirjheel": [23.7710, 90.4100],
  "Paltan Model": [23.7350, 90.4140],
  "Ramna Model": [23.7420, 90.4000],
  "Jatrabari": [23.7118, 90.4350],
  "Lalbagh": [23.7196, 90.3882],
  "Vatara": [23.8050, 90.4320],
};

function formatTimeAgo(date) {
  if (!date) return "Just now";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatClockTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function getDefaultSeverity(category) {
  const highRiskCategories = [
    "Road accident",
    "Theft",
    "Mugging",
    "Violence",
    "Hijacking",
    "Fire & Explosion",
  ];
  return highRiskCategories.includes(category) ? "high" : "caution";
}

function serializeReport(report, currentUser) {
  const currentUserId = currentUser?._id?.toString() || currentUser?.id?.toString();
  const upvoted = currentUserId
    ? (report.upvotedBy || []).some((uid) => uid.toString() === currentUserId)
    : false;
  const flagged = currentUserId
    ? (report.flaggedBy || []).some((uid) => uid.toString() === currentUserId)
    : (report.flagged || false);

  return {
    id: report._id.toString(),
    _id: report._id.toString(),
    title: report.title,
    category: report.category,
    severity: report.severity || "caution",
    thana: report.thana,
    location: report.location,
    description: report.description || "",
    position: Array.isArray(report.position) && report.position.length === 2
      ? report.position
      : [23.8103, 90.4125],
    images: report.images || [],
    upvotes: report.upvotes || 0,
    userVoted: upvoted ? "up" : null,
    flagged,
    status: report.status || "verified",
    reporterName: report.reporterName || "Anonymous Commuter",
    reportedBy: report.reportedBy ? report.reportedBy.toString() : null,
    time: formatTimeAgo(report.createdAt),
    timestamp: formatClockTime(report.createdAt),
    createdAt: report.createdAt,
    comments: (report.comments || []).map((c) => ({
      id: c._id ? c._id.toString() : undefined,
      author: c.author,
      text: c.text,
      time: formatTimeAgo(c.createdAt),
      createdAt: c.createdAt,
    })),
  };
}

async function createReport(req, res, next) {
  try {
    const {
      title,
      category,
      severity,
      thana,
      location,
      description,
      position,
      images,
    } = req.body;

    if (!category?.trim()) {
      return res.status(400).json({ success: false, message: "Please select an incident type." });
    }
    if (!thana?.trim()) {
      return res.status(400).json({ success: false, message: "Please select a thana area." });
    }
    if (!location?.trim()) {
      return res.status(400).json({ success: false, message: "Please provide a location detail." });
    }

    const cleanCategory = category.trim();
    const cleanThana = thana.trim();
    const cleanLocation = location.trim();
    const cleanDescription = (description || "").trim();

    const cleanTitle = title?.trim()
      ? title.trim()
      : `${cleanCategory} at ${cleanLocation}`;

    const cleanSeverity = severity && ["high", "caution", "resolved", "low"].includes(severity)
      ? severity
      : getDefaultSeverity(cleanCategory);

    // Resolve coordinates: provided position -> thana centroid -> default Dhaka center
    let resolvedPosition = [23.8103, 90.4125];
    if (
      Array.isArray(position) &&
      position.length === 2 &&
      !isNaN(Number(position[0])) &&
      !isNaN(Number(position[1]))
    ) {
      resolvedPosition = [Number(position[0]), Number(position[1])];
    } else if (thanaCoordinates[cleanThana]) {
      resolvedPosition = thanaCoordinates[cleanThana];
    }

    const cleanImages = Array.isArray(images)
      ? images.filter((img) => typeof img === "string" && img.trim().length > 0).slice(0, 3)
      : [];

    const newReport = await Report.create({
      title: cleanTitle,
      category: cleanCategory,
      severity: cleanSeverity,
      thana: cleanThana,
      location: cleanLocation,
      description: cleanDescription,
      position: resolvedPosition,
      images: cleanImages,
      reportedBy: req.user._id,
      reporterName: req.user.name || "Citizen Reporter",
      upvotes: 0,
      upvotedBy: [],
      flagged: false,
      status: "verified",
      comments: [],
    });

    return res.status(201).json({
      success: true,
      message: "Incident reported successfully.",
      data: {
        report: serializeReport(newReport, req.user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getReports(req, res, next) {
  try {
    const { category, thana, status, search, sortBy } = req.query;

    const query = {};

    if (category && category !== "All Categories") {
      query.category = category;
    }
    if (thana && thana !== "All Thanas") {
      query.thana = thana;
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: regex },
        { location: regex },
        { description: regex },
        { thana: regex },
      ];
    }

    const sortOption = sortBy === "upvotes" ? { upvotes: -1, createdAt: -1 } : { createdAt: -1 };

    const reports = await Report.find(query).sort(sortOption);

    return res.json({
      success: true,
      data: {
        reports: reports.map((r) => serializeReport(r, req.user)),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getReportById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Report not found." });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found." });
    }

    return res.json({
      success: true,
      data: {
        report: serializeReport(report, req.user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function voteReport(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Report not found." });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found." });
    }

    const userId = req.user._id.toString();
    const hasVoted = report.upvotedBy.some((uid) => uid.toString() === userId);

    if (hasVoted) {
      report.upvotedBy = report.upvotedBy.filter((uid) => uid.toString() !== userId);
      report.upvotes = Math.max(0, report.upvotes - 1);
    } else {
      report.upvotedBy.push(req.user._id);
      report.upvotes += 1;
    }

    await report.save();

    return res.json({
      success: true,
      message: hasVoted ? "Vote removed." : "Report verified and upvoted.",
      data: {
        report: serializeReport(report, req.user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function addComment(req, res, next) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Comment cannot be empty." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Report not found." });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found." });
    }

    const comment = {
      author: req.user.name || "Citizen",
      text: text.trim(),
      user: req.user._id,
      createdAt: new Date(),
    };

    report.comments.push(comment);
    await report.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: {
        report: serializeReport(report, req.user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createReport,
  getReports,
  getReportById,
  voteReport,
  addComment,
};
