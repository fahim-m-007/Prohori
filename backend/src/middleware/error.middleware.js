function notFound(req, res) { return res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }); }
function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error.code === 11000) return res.status(409).json({ success: false, message: "An account with this email already exists." });
  return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal server error." });
}
module.exports = { notFound, errorHandler };
