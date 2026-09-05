const jwt = require("jsonwebtoken");

function generateTokens(user) {
  const payload = { sub: user.id, role: user.role };
  return {
    accessToken: jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" }),
    refreshToken: jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }),
  };
}

function refreshCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/api/auth", maxAge: 7 * 24 * 60 * 60 * 1000 };
}

module.exports = { generateTokens, refreshCookieOptions };
