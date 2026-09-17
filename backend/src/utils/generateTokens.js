const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = { sub: user.id, role: user.role };
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
}

// Backward compatibility alias
function generateTokens(user) {
  const token = generateToken(user);
  return { token, accessToken: token };
}

module.exports = { generateToken, generateTokens };
