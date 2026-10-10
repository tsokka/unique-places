const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

function createAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, type: 'access' }, env.accessSecret, { expiresIn: env.accessTtl });
}

function createRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: 'refresh', jti: crypto.randomUUID() }, env.refreshSecret, { expiresIn: env.refreshTtl });
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { createAccessToken, createRefreshToken, hashToken };
