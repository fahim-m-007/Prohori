const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth.routes");
const { errorHandler, notFound } = require("./middleware/error.middleware");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.get("/", (_req, res) => res.json({ success: true, data: { message: "Prohori API is running." } }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-8", legacyHeaders: false }));
app.use("/api/auth", authRoutes);
app.use(notFound);
app.use(errorHandler);
module.exports = app;
