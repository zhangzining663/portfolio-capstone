// catch unknown routes and hand the error to the central handler
function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Cannot ${req.method} ${req.originalUrl}`));
}

// single place that turns every thrown error into a consistent JSON response
function errorHandler(err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || 'Something went wrong on the server',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}

module.exports = { notFound, errorHandler };
