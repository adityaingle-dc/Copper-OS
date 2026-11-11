export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  const status = error.status || (error.name === "ValidationError" ? 400 : error.name === "CastError" ? 400 : 500);
  if (status >= 500) console.error(error);
  res.status(status).json({ success: false, message: error.message || "Internal server error", ...(error.details ? { details: error.details } : {}) });
}
