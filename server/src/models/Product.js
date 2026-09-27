const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Split', 'Window', 'Cassette', 'Floor Standing', 'Duct', 'VRF/VRV', 'Other'],
      default: 'Split',
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'PKR' },
    imageKey: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
    isNewArrival: { type: Boolean, default: true },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
