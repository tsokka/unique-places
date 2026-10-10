const env = require('../config/env');
const { ApiError } = require('../utils/api-error');

async function simulateError(req, res, next) {
  if (env.allowSimulatedErrors) {
    const delay = Math.min(Math.max(Number(req.query.delay || 0), 0), 10000);
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
  }
  if (env.allowSimulatedErrors && String(req.query.simulateError) === 'true') {
    return next(new ApiError(500, 'Учебная имитация ошибки загрузки', 'SIMULATED_ERROR'));
  }
  next();
}
module.exports = { simulateError };
