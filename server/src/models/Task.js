const mongoose = require('mongoose');

/**
 * A personal to-do item a technician adds for themselves.
 * Separate from admin-assigned Booking documents.
 */
const taskSchema = new mongoose.Schema(
  {
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    notes: { type: String, default: '' },
    done: { type: Boolean, default: false },
    dueDate: { type: Date },
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
