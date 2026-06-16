const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  negotiable: { type: Boolean, default: false },
  category: { type: String, required: true },
  location: { type: String, required: true },
  condition: { type: String, enum: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair', ''], default: '' },
  make: { type: String, default: '' },       // e.g. Toyota, Samsung Galaxy, etc.
  model: { type: String, default: '' },      // e.g. Premio, Note 40 Pro, etc.
  year: { type: Number, default: null },     // year of manufacture (vehicles)
  specs: { type: mongoose.Schema.Types.Mixed, default: {} }, // RAM, storage, fuel type, etc.

  images: [{ type: String }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },
  views: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'sold', 'expired'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

listingSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
