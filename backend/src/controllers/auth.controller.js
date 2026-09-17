const User = require("../models/User");
const { generateToken } = require("../utils/generateTokens");

const serializeUser = (user) => {
  const thanaName = user.thana?.trim();
  const defaultBio = thanaName
    ? `Active commuter in ${thanaName}. Committed to making Dhaka streets safer and well-monitored for everyone.`
    : "Active commuter in Dhaka. Committed to making Dhaka streets safer and well-monitored for everyone.";

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    thana: user.thana,
    bio: user.bio || defaultBio,
    role: user.role,
  };
};
const isEmail = (email) => /^\S+@\S+\.\S+$/.test(email || "");

function clearLegacyCookie(res) {
  res.clearCookie("refreshToken", { path: "/api/auth" });
}

function sendSession(res, status, user) {
  clearLegacyCookie(res);
  const token = generateToken(user);
  return res.status(status).json({
    success: true,
    data: {
      user: serializeUser(user),
      token,
      accessToken: token,
    },
  });
}

async function register(req, res, next) {
  try {
    const { name, email, password, thana } = req.body;
    if (!name?.trim() || !isEmail(email) || !password || password.length < 8)
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Provide a name, valid email, and password of at least 8 characters.",
        });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail }))
      return res
        .status(409)
        .json({
          success: false,
          message: "An account with this email already exists.",
        });
    const thanaName = thana?.trim();
    const defaultBio = thanaName
      ? `Active commuter in ${thanaName}. Committed to making Dhaka streets safer and well-monitored for everyone.`
      : "Active commuter in Dhaka. Committed to making Dhaka streets safer and well-monitored for everyone.";
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      thana: thanaName,
      bio: defaultBio,
    });
    return sendSession(res, 201, user);
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!isEmail(email) || !password)
      return res
        .status(400)
        .json({ success: false, message: "Enter your email and password." });
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    return sendSession(res, 200, user);
  } catch (error) {
    return next(error);
  }
}

function logout(_req, res) {
  clearLegacyCookie(res);
  return res.json({
    success: true,
    message: "Logged out successfully.",
    data: null,
  });
}
function me(req, res) {
  return res.json({ success: true, data: { user: serializeUser(req.user) } });
}

async function updateProfile(req, res, next) {
  try {
    const { name, phone, thana, bio } = req.body;
    if (name !== undefined && !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Name cannot be empty." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (thana !== undefined) user.thana = thana.trim();
    if (bio !== undefined) user.bio = bio.trim();

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      data: { user: serializeUser(user) },
    });
  } catch (error) {
    return next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Provide both current password and new password.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password.",
      });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login, logout, me, updateProfile, changePassword };
