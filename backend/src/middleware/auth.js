const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/user');
const { ApiError } = require('../utils/api-error');

async function auth(req, res, next) {
  try {
    const header = req.get('Authorization') || '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) throw new ApiError(401, 'Требуется авторизация', 'UNAUTHORIZED');
    const payload = jwt.verify(match[1], env.accessSecret);
    if (payload.type !== 'access') throw new Error('Wrong token type');
    const user = await User.findById(payload.sub);
    if (!user) throw new ApiError(401, 'Пользователь не найден', 'UNAUTHORIZED');
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(new ApiError(401, 'Access token недействителен или истёк', 'ACCESS_TOKEN_INVALID'));
  }
}
module.exports = { auth };
