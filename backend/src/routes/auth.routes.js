const router = require("express").Router();
const { login, logout, me, refresh, register } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", protect, me);
module.exports = router;
