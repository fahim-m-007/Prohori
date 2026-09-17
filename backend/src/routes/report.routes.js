const router = require("express").Router();
const {
  createReport,
  getReports,
  getReportById,
  voteReport,
  addComment,
} = require("../controllers/report.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");

router.get("/", optionalAuth, getReports);
router.post("/", protect, createReport);
router.get("/:id", optionalAuth, getReportById);
router.post("/:id/vote", protect, voteReport);
router.post("/:id/comments", protect, addComment);

module.exports = router;
