const Booking = require('../models/Booking');
const User = require('../models/User');
const { ACTIVE_STATUSES } = require('../models/Booking');

/** The company's working slots. Keep in sync with the mobile app. */
const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
];

/** Day boundaries (local server time) for a given date. */
function dayRange(date) {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

/**
 * Returns the slots that still have at least one available technician.
 *
 * A technician is "busy" in a slot when they already have an active booking
 * whose timeSlot string matches. Slots where every technician is busy are
 * omitted so the customer never sees an impossible booking.
 */
async function getAvailableSlots(date, { excludeBookingId } = {}) {
  if (!date) return { slots: TIME_SLOTS, availableTechCount: 0 };

  const { start, end } = dayRange(date);

  const technicianCount = await User.countDocuments({ role: 'technician', status: 'active' });
  if (technicianCount === 0) return { slots: [], availableTechCount: 0 };

  const query = {
    scheduledDate: { $gte: start, $lt: end },
    status: { $in: ACTIVE_STATUSES },
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };

  const bookings = await Booking.find(query).select('timeSlot technicians');

  const busyBySlot = new Map();
  bookings.forEach((b) => {
    const set = busyBySlot.get(b.timeSlot) || new Set();
    b.technicians.forEach((t) => set.add(String(t)));
    busyBySlot.set(b.timeSlot, set);
  });

  const slots = TIME_SLOTS.filter((slot) => {
    const busy = busyBySlot.get(slot) || new Set();
    return busy.size < technicianCount;
  });

  return { slots, availableTechCount: technicianCount };
}

/** True when the given slot can still be served on that date. */
async function isSlotBookable(date, timeSlot, { excludeBookingId } = {}) {
  const { slots } = await getAvailableSlots(date, { excludeBookingId });
  return slots.includes(timeSlot);
}

module.exports = { TIME_SLOTS, getAvailableSlots, isSlotBookable, dayRange };
