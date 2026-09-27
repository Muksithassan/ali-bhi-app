const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['customer', 'technician', 'admin'];
const PAYOUT_TYPES = ['salary', 'commission'];
const TECHNICIAN_STATUS = ['active', 'on_leave'];

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ROLES, required: true, index: true },

    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: true, minlength: 6, select: false },

    phone: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' }, // corporate customers
    sector: { type: String, trim: true, default: '' },

    // ---- technician only ----
    employeeId: { type: String, trim: true, unique: true, sparse: true },
    payoutType: { type: String, enum: PAYOUT_TYPES, default: 'salary' },
    payoutAmount: { type: Number, default: 0 }, // fixed salary OR commission %
    status: { type: String, enum: TECHNICIAN_STATUS, default: 'active' },
    skills: { type: [String], default: [] },
    joinedAt: { type: Date, default: Date.now },

    // ---- cached performance stats (updated on job completion) ----
    completedJobs: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },

    // ---- push notifications ----
    expoPushToken: { type: String, default: '' },

    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

userSchema.virtual('rating').get(function rating() {
  if (!this.ratingCount) return 0;
  return Math.round((this.ratingSum / this.ratingCount) * 10) / 10;
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

userSchema.methods.matchPassword = function matchPassword(plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
module.exports.PAYOUT_TYPES = PAYOUT_TYPES;
