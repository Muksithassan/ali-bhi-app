const mongoose = require('mongoose');

/**
 * A bookable service offered by the company.
 * imageKey maps to a bundled asset name in the mobile app so the
 * frontend can resolve `require('../../assets/products/<imageKey>')`.
 */
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    subtitle: { type: String, default: '' },
    imageKey: { type: String, default: '' },
    category: {
      type: String,
      enum: ['ac', 'hvac', 'general'],
      default: 'ac',
    },
    requiresAcDetails: { type: Boolean, default: true }, // hides AC fields for non-AC work
    basePrice: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
