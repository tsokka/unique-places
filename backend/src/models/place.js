const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true, index: true },
  city: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  rating: { type: Number, min: 0, max: 5, default: null },
  priceLevel: { type: Number, min: 1, max: 4, default: null },
  tags: [{ type: String, trim: true }],
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  badge: { type: String, default: null },
  latitude: { type: Number, min: -90, max: 90, default: null },
  longitude: { type: Number, min: -180, max: 180, default: null },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

placeSchema.index({ name: 'text', city: 'text', country: 'text', tags: 'text', shortDescription: 'text', description: 'text' });

module.exports = mongoose.model('Place', placeSchema);
