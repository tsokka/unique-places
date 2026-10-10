const { ApiError } = require('../utils/api-error');

function notFound(req, res, next) {
  next(new ApiError(404, 'Маршрут не найден', 'NOT_FOUND'));
}

function errorHandler(err, req, res, next) {
  if (err && err.code === 11000) {
    err = new ApiError(409, 'Такая запись уже существует', 'CONFLICT');
  }
  const status = err.status || 500;
  const body = { status, message: err.message || 'Внутренняя ошибка сервера', code: err.code || 'INTERNAL_ERROR' };
  if (err.details) body.details = err.details;
  if (process.env.NODE_ENV !== 'production' && status === 500) body.stack = err.stack;
  res.status(status).json(body);
}
module.exports = { notFound, errorHandler };
