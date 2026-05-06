const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  console.error(`[${req.method} ${req.originalUrl}]`, err);
  const payload = {
    message: err.message || "Server error"
  };

  if (err.code) {
    payload.code = err.code;
  }

  if (err.setupUrl) {
    payload.setupUrl = err.setupUrl;
  }

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

module.exports = { notFound, errorHandler };
