const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateTokens, refreshCookieOptions } = require("../utils/generateTokens");

const serializeUser = (user) => ({ id: user.id, name: user.name, email: user.email, thana: user.thana, role: user.role });
const isEmail = (email) => /^\S+@\S+\.\S+$/.test(email || "");

function sendSession(res, status, user) {
  const { accessToken, refreshToken } = generateTokens(user);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions());
  return res.status(status).json({ success: true, data: { user: serializeUser(user), accessToken } });
}

async function register(req, res, next) {
  try {
    const { name, email, password, thana } = req.body;
    if (!name?.trim() || !isEmail(email) || !password || password.length < 8) return res.status(400).json({ success: false, message: "Provide a name, valid email, and password of at least 8 characters." });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ success: false, message: "An account with this email already exists." });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password, thana: thana?.trim() });
    return sendSession(res, 201, user);
  } catch (error) { return next(error); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!isEmail(email) || !password) return res.status(400).json({ success: false, message: "Enter your email and password." });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: "Invalid email or password." });
    return sendSession(res, 200, user);
  } catch (error) { return next(error); }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ success: false, message: "Session is no longer valid." });
    return sendSession(res, 200, user);
  } catch (error) {
    if (["JsonWebTokenError", "TokenExpiredError"].includes(error.name)) return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    return next(error);
  }
}

function logout(_req, res) { res.clearCookie("refreshToken", refreshCookieOptions()); return res.json({ success: true, data: null }); }
function me(req, res) { return res.json({ success: true, data: { user: serializeUser(req.user) } }); }

module.exports = { register, login, refresh, logout, me };
