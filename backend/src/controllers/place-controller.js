const mongoose = require('mongoose');
const Place = require('../models/place');
const Favorite = require('../models/favorite');
const { ApiError } = require('../utils/api-error');
const { serialize } = require('../utils/serialize');

function publishedFilter(category) {
  const filter = { isPublished: true };
  if (category && category !== 'all') filter.category = category;
  return filter;
}

async function listPlaces(req, res) {
  const places = await Place.find(publishedFilter(req.query.category)).sort({ createdAt: 1 });
  res.json({ items: places.map(serialize), total: places.length });
}

async function getPlace(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(404, 'Место не найдено', 'PLACE_NOT_FOUND');
  const place = await Place.findOne({ _id: req.params.id, isPublished: true });
  if (!place) throw new ApiError(404, 'Место не найдено', 'PLACE_NOT_FOUND');
  res.json({ place: serialize(place) });
}

async function searchPlaces(req, res) {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json({ items: [], total: 0, query: '' });
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'i');
  const places = await Place.find({ isPublished: true, $or: [
    { name: regex }, { city: regex }, { country: regex }, { tags: regex }, { shortDescription: regex }, { description: regex }
  ]}).sort({ rating: -1, name: 1 });
  res.json({ items: places.map(serialize), total: places.length, query: q });
}

async function recommendations(req, res) {
  const limit = Math.min(Math.max(Number(req.query.limit || 3), 1), 12);
  let excluded = [];
  if (req.user) {
    excluded = (await Favorite.find({ userId: req.user._id }).select('placeId')).map(x => x.placeId);
  }
  const extra = String(req.query.exclude || '').split(',').filter(mongoose.isValidObjectId);
  excluded.push(...extra);
  const match = { isPublished: true, ...(excluded.length ? { _id: { $nin: excluded } } : {}) };
  const items = await Place.aggregate([{ $match: match }, { $sample: { size: limit } }]);
  res.json({ items: items.map(serialize), total: items.length });
}
module.exports = { listPlaces, getPlace, searchPlaces, recommendations };
