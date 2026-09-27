/**
 * Bootstraps the database: creates/refreshes the admin account and inserts a
 * starting service catalogue.
 *
 *   npm run seed
 *
 * Safe to run repeatedly - the admin is looked up by email and services are
 * matched by name, so nothing is duplicated. An existing admin's password is
 * only overwritten when ADMIN_RESET_PASSWORD=true is set.
 */
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Service = require('./models/Service');
const { connectDB } = require('./config/db');

const ADMIN = {
  name: process.env.ADMIN_NAME || 'ACP Admin',
  email: String(process.env.ADMIN_EMAIL || 'admin@acp.com').toLowerCase(),
  password: process.env.ADMIN_PASSWORD || 'Admin@123',
};

// Starting catalogue. Prices are placeholders - edit them in
// Admin -> Services, and let customers book once they look right.
const SERVICES = [
  { name: 'Split AC Service & Repair', subtitle: 'Cleaning, gas charging & fault repair', imageKey: 'split_ac', category: 'ac', requiresAcDetails: true, basePrice: 2500, sortOrder: 1 },
  { name: 'Cassette AC Service & Repair', subtitle: 'Deep cleaning & maintenance', imageKey: 'cassette_ac', category: 'ac', requiresAcDetails: true, basePrice: 3000, sortOrder: 2 },
  { name: 'Floor Standing AC Service', subtitle: 'Servicing & repair for floor units', imageKey: 'floor_ac', category: 'ac', requiresAcDetails: true, basePrice: 3200, sortOrder: 3 },
  { name: 'HVAC Installation & Ducting', subtitle: 'New installation and duct work', imageKey: 'hvac', category: 'hvac', requiresAcDetails: true, basePrice: 8000, sortOrder: 4 },
  { name: 'Annual Maintenance Contract (AMC)', subtitle: 'Scheduled visits all year round', imageKey: 'amc_icon', category: 'ac', requiresAcDetails: true, basePrice: 12000, sortOrder: 5 },
  { name: 'Preventive Maintenance Visit', subtitle: 'Health check to avoid breakdowns', imageKey: 'pm_icon', category: 'ac', requiresAcDetails: true, basePrice: 2000, sortOrder: 6 },
  { name: 'False Ceiling & Interior Works', subtitle: 'Ceiling, gypsum and light work', imageKey: 'false_ceiling', category: 'general', requiresAcDetails: false, basePrice: 0, sortOrder: 7 },
  { name: 'Electrical Works & Wiring', subtitle: 'Wiring, DB and safety checks', imageKey: 'electric_icon', category: 'general', requiresAcDetails: false, basePrice: 0, sortOrder: 8 },
  { name: 'Renovation & Fit-out', subtitle: 'Full room and office renovation', imageKey: 'reno_icon', category: 'general', requiresAcDetails: false, basePrice: 0, sortOrder: 9 },
];

// Existing admin passwords are left alone unless explicitly asked for, so
// running the seed after deploying can never lock a real admin out.
const RESET_PASSWORD = /^(1|true|yes)$/i.test(process.env.ADMIN_RESET_PASSWORD || '');

async function seedAdmin() {
  const existing = await User.findOne({ email: ADMIN.email }).select('+password');

  if (existing) {
    existing.role = 'admin';
    existing.name = ADMIN.name;
    existing.isActive = true;
    if (RESET_PASSWORD) existing.password = ADMIN.password;
    await existing.save();
    return RESET_PASSWORD
      ? `[seed] admin updated: ${ADMIN.email} (password reset to ADMIN_PASSWORD)`
      : `[seed] admin already exists: ${ADMIN.email} (password untouched - set ADMIN_RESET_PASSWORD=true to reset it)`;
  }

  await User.create({
    role: 'admin',
    name: ADMIN.name,
    email: ADMIN.email,
    password: ADMIN.password,
  });
  return `[seed] admin created: ${ADMIN.email}`;
}

async function seedServices() {
  let created = 0;
  for (const service of SERVICES) {
    const exists = await Service.findOne({ name: service.name });
    if (exists) continue; // eslint-disable-line no-await-in-loop
    // eslint-disable-next-line no-await-in-loop
    await Service.create({ ...service, isActive: true });
    created += 1;
  }
  return `[seed] services: ${created} added, ${SERVICES.length - created} already present`;
}

async function run() {
  try {
    await connectDB(process.env.MONGODB_URI, 3);
    console.log(await seedAdmin());
    console.log(await seedServices());
    console.log('[seed] done');
  } catch (err) {
    console.error('[seed] failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
