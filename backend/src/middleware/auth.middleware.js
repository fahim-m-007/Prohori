const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Authentication is required." });
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET,
    );
    const user = await User.findById(payload.sub);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Account no longer exists." });
    req.user = user;
    return next();
  } catch (error) {
    if (["JsonWebTokenError", "TokenExpiredError"].includes(error.name))
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token." });
    return next(error);
  }
}

async function optionalAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;
    if (!token) return next();
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET,
    );
    const user = await User.findById(payload.sub);
    if (user) req.user = user;
    return next();
  } catch (_error) {
    return next();
  }
}

const authorize =
  (...roles) =>
  (req, res, next) =>
    roles.includes(req.user.role)
      ? next()
      : res
          .status(403)
          .json({
            success: false,
            message: "You do not have permission to access this resource.",
          });

module.exports = { protect, optionalAuth, authorize };
