const mongoose = require('mongoose');

const BOOKING_STATUS = [
  'pending', // waiting for admin confirmation
  'confirmed', // admin confirmed but not yet assigned
  'assigned', // technician(s) assigned
  'in_progress', // technician started the job
  'completed',
  'cancelled',
];

// Statuses that still occupy a technician's calendar.
const ACTIVE_STATUSES = ['pending', 'confirmed', 'assigned', 'in_progress'];

const bookingSchema = new mongoose.Schema(
  {
    bookingNo: { type: String, unique: true, index: true },

    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    serviceName: { type: String, required: true, trim: true },

    // ---- dynamic booking form fields ----
    acType: { type: String, default: '' }, // Split / Window / Cassette / ... / Other
    acTypeOther: { type: String, default: '' },
    units: { type: Number, default: 1, min: 1 },
    problem: { type: String, default: '' },
    address: { type: String, required: true, trim: true },
    scheduledDate: { type: Date, required: true, index: true },
    timeSlot: { type: String, required: true }, // e.g. "09:00-10:00"
    paymentMethod: { type: String, enum: ['cash'], default: 'cash' },

    // ---- workflow ----
    status: { type: String, enum: BOOKING_STATUS, default: 'pending', index: true },
    technicians: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
    price: { type: Number, default: 0 },
    adminNote: { type: String, default: '' },
    cancelReason: { type: String, default: '' },

    // ---- job evidence ----
    beforeImages: { type: [String], default: [] },
    afterImages: { type: [String], default: [] },
    startedAt: { type: Date },
    completedAt: { type: Date },

    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookingSchema.index({ scheduledDate: 1, timeSlot: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
module.exports.BOOKING_STATUS = BOOKING_STATUS;
module.exports.ACTIVE_STATUSES = ACTIVE_STATUSES;
