const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const Review = require('../models/Review');
const { ACTIVE_STATUSES } = require('../models/Booking');
const { getAvailableSlots, isSlotBookable, TIME_SLOTS } = require('../utils/availability');
const { nextBookingNo } = require('../utils/counter');
const { notifyUser, notifyUsers } = require('../utils/push');

const CUSTOMER_FIELDS = 'name email phone company address';

function populateBooking(query) {
  return query
    .populate('customer', CUSTOMER_FIELDS)
    .populate('technicians', 'name email phone employeeId status rating completedJobs')
    .populate('service', 'name subtitle imageKey');
}

// @desc  Working time slots for a date (only where a technician is free)
// @route GET /api/bookings/availability?date=YYYY-MM-DD
// @access Private
const availability = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) {
    res.status(400);
    throw new Error('date query param is required (YYYY-MM-DD)');
  }
  const { slots, availableTechCount } = await getAvailableSlots(date);
  res.json({ success: true, date, allSlots: TIME_SLOTS, slots, availableTechCount });
});

// @desc  Customer creates a booking
// @route POST /api/bookings
// @access Private (customer)
const createBooking = asyncHandler(async (req, res) => {
  const {
    serviceId,
    serviceName,
    acType = '',
    acTypeOther = '',
    units = 1,
    problem = '',
    address,
    scheduledDate,
    timeSlot,
  } = req.body;

  if (!address || !scheduledDate || !timeSlot) {
    res.status(400);
    throw new Error('address, scheduledDate and timeSlot are required');
  }

  // Resolve service + whether AC details apply
  let service = null;
  let resolvedName = serviceName;
  if (serviceId) {
    service = await Service.findById(serviceId);
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }
    resolvedName = service.name;
  }
  if (!resolvedName) {
    res.status(400);
    throw new Error('serviceName or serviceId is required');
  }

  // Guard against double-booking a full slot
  const bookable = await isSlotBookable(scheduledDate, timeSlot);
  if (!bookable) {
    res.status(409);
    throw new Error('That time slot is no longer available. Please pick another slot.');
  }

  const booking = await Booking.create({
    bookingNo: await nextBookingNo(),
    customer: req.user._id,
    service: service?._id,
    serviceName: resolvedName,
    acType,
    acTypeOther,
    units,
    problem,
    address,
    scheduledDate,
    timeSlot,
    price: service?.basePrice || 0,
    status: 'pending',
  });

  // Let admins know a new request landed.
  const admins = await User.find({ role: 'admin' });
  await notifyUsers(admins, {
    title: 'New service request',
    body: `${booking.bookingNo} - ${resolvedName} for ${req.user.name}`,
    type: 'booking_status',
    booking: booking._id,
  });

  const created = await populateBooking(Booking.findById(booking._id));
  res.status(201).json({ success: true, booking: created });
});

// @desc  List bookings, scoped by role
// @route GET /api/bookings?status=&tab=&from=&to=
// @access Private
const listBookings = asyncHandler(async (req, res) => {
  const { status, tab, from, to, technician } = req.query;
  const filter = {};

  if (req.user.role === 'customer') {
    filter.customer = req.user._id;
  } else if (req.user.role === 'technician') {
    filter.technicians = req.user._id;
  } else if (technician) {
    filter.technicians = technician;
  }

  // Admin overview tabs
  if (tab === 'pending') filter.status = 'pending';
  else if (tab === 'cancelled') filter.status = 'cancelled';
  else if (tab === 'active') filter.status = { $in: ACTIVE_STATUSES };
  else if (status) filter.status = status;

  if (from || to) {
    filter.scheduledDate = {};
    if (from) filter.scheduledDate.$gte = new Date(from);
    if (to) filter.scheduledDate.$lte = new Date(to);
  }

  const bookings = await populateBooking(
    Booking.find(filter).sort({ createdAt: -1 }).limit(500)
  );

  const counts = {
    total: await Booking.countDocuments(
      req.user.role === 'customer' ? { customer: req.user._id } : {}
    ),
    pending: await Booking.countDocuments({ status: 'pending' }),
    cancelled: await Booking.countDocuments({ status: 'cancelled' }),
    completed: await Booking.countDocuments({ status: 'completed' }),
  };

  res.json({ success: true, count: bookings.length, counts, bookings });
});

// @desc  Single booking
// @route GET /api/bookings/:id
// @access Private (owner, assigned tech, admin)
const getBooking = asyncHandler(async (req, res) => {
  const booking = await populateBooking(Booking.findById(req.params.id));
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const isOwner = String(booking.customer?._id) === String(req.user._id);
  const isAssigned = booking.technicians.some((t) => String(t._id) === String(req.user._id));
  if (req.user.role !== 'admin' && !isOwner && !isAssigned) {
    res.status(403);
    throw new Error('Not allowed to view this booking');
  }

  const review = await Review.findOne({ booking: booking._id }).populate('customer', 'name');
  res.json({ success: true, booking, review });
});

// @desc  Admin confirms a pending booking
// @route PATCH /api/bookings/:id/confirm
// @access Private (admin)
const confirmBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (booking.status !== 'pending') {
    res.status(400);
    throw new Error(`Only pending bookings can be confirmed (current: ${booking.status})`);
  }

  booking.status = 'confirmed';
  booking.adminNote = req.body.adminNote ?? booking.adminNote;
  await booking.save();

  await notifyUser(
    await User.findById(booking.customer),
    {
      title: 'Booking confirmed',
      body: `Your request ${booking.bookingNo} has been confirmed.`,
      type: 'booking_status',
      booking: booking._id,
    }
  );

  res.json({ success: true, booking: await populateBooking(Booking.findById(booking._id)) });
});

// @desc  Admin assigns one or more technicians and notifies them
// @route PATCH /api/bookings/:id/assign
// @access Private (admin)
const assignTechnicians = asyncHandler(async (req, res) => {
  const { technicianIds } = req.body;
  if (!Array.isArray(technicianIds) || technicianIds.length === 0) {
    res.status(400);
    throw new Error('technicianIds must be a non-empty array');
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (['completed', 'cancelled'].includes(booking.status)) {
    res.status(400);
    throw new Error(`Cannot assign a ${booking.status} booking`);
  }

  const techs = await User.find({ _id: { $in: technicianIds }, role: 'technician' });
  if (techs.length !== technicianIds.length) {
    res.status(404);
    throw new Error('One or more technicians were not found');
  }

  booking.technicians = techs.map((t) => t._id);
  if (booking.status === 'pending' || booking.status === 'confirmed') {
    booking.status = 'assigned';
  }
  booking.adminNote = req.body.adminNote ?? booking.adminNote;
  await booking.save();

  // Auto notification to the assigned team.
  await notifyUsers(techs, {
    title: 'New job assigned',
    body: `${booking.bookingNo} - ${booking.serviceName} at ${booking.address}`,
    type: 'job_assigned',
    booking: booking._id,
    data: { timeSlot: booking.timeSlot, date: booking.scheduledDate },
  });

  await notifyUser(
    await User.findById(booking.customer),
    {
      title: 'Technician assigned',
      body: `A technician has been assigned to ${booking.bookingNo}.`,
      type: 'booking_status',
      booking: booking._id,
    }
  );

  res.json({ success: true, booking: await populateBooking(Booking.findById(booking._id)) });
});

// @desc  Admin or customer cancels a booking
// @route PATCH /api/bookings/:id/cancel
// @access Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (req.user.role === 'customer' && String(booking.customer) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not allowed to cancel this booking');
  }
  if (['completed', 'cancelled'].includes(booking.status)) {
    res.status(400);
    throw new Error(`Booking is already ${booking.status}`);
  }

  booking.status = 'cancelled';
  booking.cancelReason = req.body.reason || '';
  await booking.save();

  await notifyUsers(
    await User.find({ _id: { $in: booking.technicians } }),
    {
      title: 'Job cancelled',
      body: `${booking.bookingNo} has been cancelled.`,
      type: 'booking_status',
      booking: booking._id,
    }
  );

  res.json({ success: true, booking: await populateBooking(Booking.findById(booking._id)) });
});

// @desc  Assigned technician starts the job
// @route PATCH /api/bookings/:id/start
// @access Private (technician)
const startJob = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!booking.technicians.some((t) => String(t) === String(req.user._id))) {
    res.status(403);
    throw new Error('You are not assigned to this job');
  }

  booking.status = 'in_progress';
  booking.startedAt = new Date();
  await booking.save();

  await notifyUser(
    await User.findById(booking.customer),
    {
      title: 'Work started',
      body: `Your technician has started work on ${booking.bookingNo}.`,
      type: 'booking_status',
      booking: booking._id,
    }
  );

  res.json({ success: true, booking: await populateBooking(Booking.findById(booking._id)) });
});

// @desc  Attach before/after photos
// @route PATCH /api/bookings/:id/evidence
// @access Private (technician)
const uploadEvidence = asyncHandler(async (req, res) => {
  const { beforeImages, afterImages } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!booking.technicians.some((t) => String(t) === String(req.user._id))) {
    res.status(403);
    throw new Error('You are not assigned to this job');
  }

  if (Array.isArray(beforeImages)) booking.beforeImages = beforeImages;
  if (Array.isArray(afterImages)) booking.afterImages = afterImages;
  await booking.save();

  res.json({ success: true, booking });
});

// @desc  Technician marks the job done
// @route PATCH /api/bookings/:id/complete
// @access Private (technician)
const completeJob = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!booking.technicians.some((t) => String(t) === String(req.user._id))) {
    res.status(403);
    throw new Error('You are not assigned to this job');
  }
  if (booking.status === 'completed') {
    res.status(400);
    throw new Error('Job is already completed');
  }

  booking.status = 'completed';
  booking.completedAt = new Date();
  if (req.body.price !== undefined) booking.price = req.body.price;
  if (Array.isArray(req.body.afterImages)) booking.afterImages = req.body.afterImages;
  await booking.save();

  // Update cached technician stats: completed count and payout accrual.
  const techs = await User.find({ _id: { $in: booking.technicians } });
  await Promise.all(
    techs.map(async (tech) => {
      tech.completedJobs += 1;
      if (tech.payoutType === 'commission') {
        tech.earnings += Math.round(((tech.payoutAmount || 0) / 100) * (booking.price || 0));
      }
      await tech.save();
    })
  );

  await notifyUser(
    await User.findById(booking.customer),
    {
      title: 'Job completed',
      body: `${booking.bookingNo} is complete. Please rate your technician.`,
      type: 'job_completed',
      booking: booking._id,
    }
  );

  res.json({ success: true, booking: await populateBooking(Booking.findById(booking._id)) });
});

module.exports = {
  availability,
  createBooking,
  listBookings,
  getBooking,
  confirmBooking,
  assignTechnicians,
  cancelBooking,
  startJob,
  uploadEvidence,
  completeJob,
};
