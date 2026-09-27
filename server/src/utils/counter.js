const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

/**
 * Atomically increments and returns the next number for a key.
 * Used to build display ids like SR-2026-0001.
 */
async function nextSeq(key) {
  const doc = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
}

async function nextBookingNo() {
  const year = new Date().getFullYear();
  const seq = await nextSeq(`booking-${year}`);
  return `SR-${year}-${String(seq).padStart(3, '0')}`;
}

async function nextPurchaseNo() {
  const year = new Date().getFullYear();
  const seq = await nextSeq(`purchase-${year}`);
  return `PR-${year}-${String(seq).padStart(3, '0')}`;
}

module.exports = { nextSeq, nextBookingNo, nextPurchaseNo, Counter };
