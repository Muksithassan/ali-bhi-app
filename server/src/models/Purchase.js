const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    purchaseNo: { type: String, unique: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

    // snapshot of what was requested
    productTitle: { type: String, required: true },
    price: { type: Number, default: 0 },

    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    note: { type: String, default: '' },

    status: {
      type: String,
      enum: ['new', 'contacted', 'confirmed', 'delivered', 'closed', 'cancelled'],
      default: 'new',
      index: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
