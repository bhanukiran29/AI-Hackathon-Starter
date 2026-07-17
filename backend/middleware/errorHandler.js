export function errorHandler(err, req, res, next) {
  console.error("❌ Error caught by global handler:", err);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}
