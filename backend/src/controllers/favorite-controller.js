const mongoose = require('mongoose');
const Favorite = require('../models/favorite');
const Place = require('../models/place');
const { ApiError } = require('../utils/api-error');
const { serialize } = require('../utils/serialize');

async function listFavorites(req, res) {
  const rows = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 }).populate('placeId');
  const items = rows.filter(x => x.placeId && x.placeId.isPublished).map(x => serialize(x.placeId));
  res.json({ items, total: items.length });
}

async function addFavorite(req, res) {
  const { placeId } = req.body || {};
  if (!mongoose.isValidObjectId(placeId)) throw new ApiError(400, 'Некорректный placeId', 'VALIDATION_ERROR');
  const place = await Place.findOne({ _id: placeId, isPublished: true });
  if (!place) throw new ApiError(404, 'Место не найдено', 'PLACE_NOT_FOUND');
  const favorite = await Favorite.findOneAndUpdate({ userId: req.user._id, placeId }, { $setOnInsert: { userId: req.user._id, placeId } }, { upsert: true, new: true });
  res.status(201).json({ favorite: { id: String(favorite._id), placeId: String(place._id), createdAt: favorite.createdAt }, place: serialize(place) });
}

async function removeFavorite(req, res) {
  if (!mongoose.isValidObjectId(req.params.placeId)) throw new ApiError(400, 'Некорректный placeId', 'VALIDATION_ERROR');
  const result = await Favorite.deleteOne({ userId: req.user._id, placeId: req.params.placeId });
  if (!result.deletedCount) throw new ApiError(404, 'Место отсутствует в избранном', 'FAVORITE_NOT_FOUND');
  res.json({ ok: true });
}
module.exports = { listFavorites, addFavorite, removeFavorite };
