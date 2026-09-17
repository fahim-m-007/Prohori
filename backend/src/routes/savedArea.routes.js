const router = require("express").Router();
const {
  getSavedAreas,
  createSavedArea,
  updateSavedArea,
  deleteSavedArea,
} = require("../controllers/savedArea.controller");
const { protect } = require("../middleware/auth.middleware");

// All saved area routes require authentication
router.use(protect);

router.route("/").get(getSavedAreas).post(createSavedArea);

router.route("/:id").patch(updateSavedArea).delete(deleteSavedArea);

module.exports = router;
