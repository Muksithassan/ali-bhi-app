const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { signToken } = require('../middleware/auth');

function authPayload(user, token) {
  return {
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      company: user.company,
      employeeId: user.employeeId,
      payoutType: user.payoutType,
      payoutAmount: user.payoutAmount,
      status: user.status,
      completedJobs: user.completedJobs,
      rating: user.rating,
      earnings: user.earnings,
    },
  };
}

// @desc  Register a customer
// @route POST /api/auth/signup
// @access Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone = '', address = '', company = '' } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  if (String(password).length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  // Technicians and admins are never self-registered.
  const user = await User.create({
    role: 'customer',
    name,
    email,
    password,
    phone,
    address,
    company,
  });

  res.status(201).json(authPayload(user, signToken(user)));
});

// @desc  Login (customer / technician / admin)
// @route POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (!user.isActive) {
    res.status(403);
    throw new Error('This account has been disabled');
  }

  res.json(authPayload(user, signToken(user)));
});

// @desc  Current user
// @route GET /api/auth/me
// @access Private
const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

// @desc  Update own profile
// @route PATCH /api/auth/me
// @access Private
const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'address', 'company', 'sector'];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, user });
});

// @desc  Change own password
// @route PATCH /api/auth/password
// @access Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || String(newPassword).length < 6) {
    res.status(400);
    throw new Error('Current password and a 6+ character new password are required');
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});

// @desc  Register/refresh the Expo push token for this device
// @route POST /api/auth/push-token
// @access Private
const registerPushToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    res.status(400);
    throw new Error('token is required');
  }
  req.user.expoPushToken = token;
  await req.user.save();
  res.json({ success: true, message: 'Push token registered' });
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc  Google Login / Registration
// @route POST /api/auth/google
// @access Public
const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error('No Google token provided');
  }

  // Verify token against known client IDs
  const validAudiences = [
    process.env.GOOGLE_CLIENT_ID,
    '245458778051-23rdejm0b384kgqhj7dk392hkeasdfp6.apps.googleusercontent.com',
    '245458778051-5fai95dkp4hm34vnecgd7le0lj5inee6.apps.googleusercontent.com',
  ].filter(Boolean);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: validAudiences,
  });
  const payload = ticket.getPayload();

  const { email, name, sub } = payload; // sub is google's user ID

  let user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Register as new customer if doesn't exist
    user = await User.create({
      name,
      email: email.toLowerCase(),
      password: sub, // Dummy password using google ID
      role: 'customer', 
    });
  }

  const token = signToken(user);
  res.json(authPayload(user, token));
});

module.exports = {
  signup,
  login,
  googleLogin,
  me,
  updateMe,
  changePassword,
  registerPushToken,
};
