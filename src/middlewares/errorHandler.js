/**
 * Global error-handling middleware for Express.
 * Catches all unhandled errors and returns a consistent JSON response.
 */
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  // Handle multer-specific errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'The uploaded file exceeds the maximum allowed size.',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: 'Unexpected field',
      message: 'The upload field name must be "file".',
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
