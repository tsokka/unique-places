const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const RefreshToken = require('../models/refresh-token');
const env = require('../config/env');
const { ApiError } = require('../utils/api-error');
const { createAccessToken, createRefreshToken, hashToken } = require('../utils/tokens');
const { serialize } = require('../utils/serialize');

async function persistRefreshToken(user, token) {
  const decoded = jwt.decode(token);
  await RefreshToken.create({ userId: user._id, tokenHash: hashToken(token), expiresAt: new Date(decoded.exp * 1000) });
}

function validateRegistration(name, email, password) {
  if (!name || !email || !password) throw new ApiError(400, 'Имя, email и пароль обязательны', 'VALIDATION_ERROR');
  const normalizedEmail = String(email).toLowerCase().trim();
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) throw new ApiError(400, 'Некорректный email', 'VALIDATION_ERROR');
  if (String(password).length < 6) throw new ApiError(400, 'Пароль должен содержать минимум 6 символов', 'VALIDATION_ERROR');
  return normalizedEmail;
}

async function register(req, res) {
  const { name, email, password } = req.body || {};
  const normalizedEmail = validateRegistration(name, email, password);
  if (await User.exists({ email: normalizedEmail })) throw new ApiError(409, 'Пользователь с таким email уже существует', 'EMAIL_ALREADY_EXISTS');

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await User.create({ name: String(name).trim(), email: normalizedEmail, passwordHash });
  res.status(201).json({ user: serialize(user) });
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) throw new ApiError(400, 'Email и пароль обязательны', 'VALIDATION_ERROR');
  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new ApiError(401, 'Неверный email или пароль', 'INVALID_CREDENTIALS');
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  await persistRefreshToken(user, refreshToken);
  res.json({ accessToken, refreshToken, user: serialize(user) });
}

async function refresh(req, res) {
  const { refreshToken } = req.body || {};
  if (!refreshToken) throw new ApiError(400, 'refreshToken обязателен', 'VALIDATION_ERROR');
  let payload;
  try { payload = jwt.verify(refreshToken, env.refreshSecret); } catch { throw new ApiError(401, 'Refresh token недействителен или истёк', 'REFRESH_TOKEN_INVALID'); }
  if (payload.type !== 'refresh') throw new ApiError(401, 'Некорректный тип токена', 'REFRESH_TOKEN_INVALID');

  const stored = await RefreshToken.findOne({ tokenHash: hashToken(refreshToken), revokedAt: null, expiresAt: { $gt: new Date() } });
  if (!stored) throw new ApiError(401, 'Refresh token отозван или истёк', 'REFRESH_TOKEN_INVALID');

  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, 'Пользователь не найден', 'REFRESH_TOKEN_INVALID');

  // Намеренно без ротации: один и тот же refresh token действует до logout/истечения.
  // Это упрощает учебный interceptor: frontend получает только новый access token.
  res.json({ accessToken: createAccessToken(user) });
}

async function logout(req, res) {
  const { refreshToken } = req.body || {};
  if (refreshToken) await RefreshToken.updateOne({ tokenHash: hashToken(refreshToken), userId: req.user._id }, { revokedAt: new Date() });
  res.json({ ok: true });
}

async function me(req, res) { res.json({ user: serialize(req.user) }); }
module.exports = { register, login, refresh, logout, me };
