const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { notifyUser } = require('../utils/push');

// @desc  List technicians
// @route GET /api/technicians?search=&status=
// @access Private (admin + customer read for availability info)
const listTechnicians = asyncHandler(async (req, res) => {
  const { search = '', status } = req.query;
  const filter = { role: 'technician' };
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { employeeId: new RegExp(search, 'i') },
    ];
  }

  const technicians = await User.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: technicians.length, technicians });
});

// @desc  Create a technician profile (admin provides the credentials)
// @route POST /api/technicians
// @access Private (admin)
const createTechnician = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone = '',
    payoutType = 'salary',
    payoutAmount = 0,
    skills = [],
    status = 'active',
  } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('name, email and password are required');
  }
  if (String(password).length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }
  if (!['salary', 'commission'].includes(payoutType)) {
    res.status(400);
    throw new Error('payoutType must be salary or commission');
  }

  const exists = await User.findOne({ email: String(email).toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const count = await User.countDocuments({ role: 'technician' });
  const employeeId = `TECH-${String(count + 1).padStart(3, '0')}`;

  const technician = await User.create({
    role: 'technician',
    name,
    email,
    password,
    phone,
    payoutType,
    payoutAmount,
    skills,
    status,
    employeeId,
    createdBy: req.user._id,
  });

  await notifyUser(technician, {
    title: 'Welcome to ACP',
    body: 'Your technician account is ready. Jobs assigned to you will appear here.',
    type: 'general',
  });

  res.status(201).json({ success: true, technician });
});

// @desc  Update a technician
// @route PATCH /api/technicians/:id
// @access Private (admin)
const updateTechnician = asyncHandler(async (req, res) => {
  const allowed = [
    'name',
    'phone',
    'payoutType',
    'payoutAmount',
    'skills',
    'status',
    'isActive',
  ];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const technician = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'technician' },
    updates,
    { new: true, runValidators: true }
  );
  if (!technician) {
    res.status(404);
    throw new Error('Technician not found');
  }

  // Password reset by admin
  if (req.body.password) {
    if (String(req.body.password).length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }
    technician.password = req.body.password;
    await technician.save();
  }

  res.json({ success: true, technician });
});

// @desc  Remove a technician
// @route DELETE /api/technicians/:id
// @access Private (admin)
const deleteTechnician = asyncHandler(async (req, res) => {
  const activeJobs = await Booking.countDocuments({
    technicians: req.params.id,
    status: { $in: ['pending', 'confirmed', 'assigned', 'in_progress'] },
  });
  if (activeJobs > 0) {
    res.status(409);
    throw new Error(`Technician still has ${activeJobs} active job(s). Reassign them first.`);
  }

  const technician = await User.findOneAndDelete({ _id: req.params.id, role: 'technician' });
  if (!technician) {
    res.status(404);
    throw new Error('Technician not found');
  }
  res.json({ success: true, message: 'Technician removed' });
});

// @desc  Technician profile: stats + reviews
// @route GET /api/technicians/:id/profile
// @access Private
const technicianProfile = asyncHandler(async (req, res) => {
  const technician = await User.findOne({ _id: req.params.id, role: 'technician' });
  if (!technician) {
    res.status(404);
    throw new Error('Technician not found');
  }

  const [reviews, upcoming, completed] = await Promise.all([
    Review.find({ technician: technician._id })
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(50),
    Booking.find({
      technicians: technician._id,
      status: { $in: ['assigned', 'in_progress'] },
    })
      .select('bookingNo serviceName scheduledDate timeSlot address status')
      .sort({ scheduledDate: 1 })
      .limit(20),
    Booking.countDocuments({ technicians: technician._id, status: 'completed' }),
  ]);

  res.json({
    success: true,
    technician,
    stats: {
      completedJobs: completed,
      rating: technician.rating,
      ratingCount: technician.ratingCount,
      earnings: technician.earnings,
    },
    reviews,
    upcomingJobs: upcoming,
  });
});

module.exports = {
  listTechnicians,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  technicianProfile,
};
