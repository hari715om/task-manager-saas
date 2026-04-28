const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url} —`, err.message);

  const status = err.status || err.statusCode || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  res.status(status).json({ message });
};

module.exports = { errorHandler };
