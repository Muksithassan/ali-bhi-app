require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/error');
const { connectDB, dbStatus } = require('./config/db');

const app = express();

const PORT = Number(process.env.PORT) || 5000;
// Hosting platforms (Render, Railway, Fly, ...) require the process to accept
// connections from outside the container, so bind all interfaces.
const HOST = process.env.HOST || '0.0.0.0';

// --- Middleware -------------------------------------------------------

// CORS_ORIGIN is a comma separated allow-list. "*" (the default) allows any
// origin, which is what the React Native app needs.
const corsOrigin = (process.env.CORS_ORIGIN || '*').trim();
app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim()),
  })
);
// Job evidence photos are uploaded as base64 strings, well over the 100kb default.
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// --- Health / root ----------------------------------------------------
// Used by Render's port scan and by the app to verify the API is up.
app.get('/health', (req, res) => {
  const db = dbStatus();
  res.status(200).json({
    status: db.connected ? 'ok' : 'connecting',
    database: db.state,
    readyState: db.readyState,
    uptime: process.uptime(),
  });
});

app.get('/', (req, res) => {
  res.status(200).send(`Ali Cool Point API is running (db: ${dbStatus().state})`);
});

// --- Routes -----------------------------------------------------------
app.use('/api', routes);

// --- Errors -----------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// --- Environment sanity check ----------------------------------------
const REQUIRED_ENV = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.error(`❌ Missing required environment variable(s): ${missingEnv.join(', ')}`);
  console.error('   Set them in server/.env locally and in the Render dashboard for deploys.');
}

// --- Boot -------------------------------------------------------------
// Listen BEFORE connecting to the database. If Atlas is unreachable (the usual
// cause is a missing IP access list entry) the HTTP server must still come up,
// otherwise Render reports "No open ports detected" and stops the deploy.
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server listening on http://${HOST}:${PORT}`);
});

connectDB()
  .then(() => console.log('✅ MongoDB connection ready'))
  .catch((err) => {
    // Only reached when the retry count is finite; the HTTP server stays up and
    // `/health` keeps reporting the database state.
    console.error('❌ Could not connect to MongoDB:', err.message);
    console.error('   API calls will fail until the database is reachable.');
  });

// A redeploy on Render sends SIGTERM: close the listener so the port is freed.
['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.on(signal, () => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(() => process.exit(0));
  });
});

// Never let a stray rejection (e.g. a buffered query timing out while the DB is
// down) take the whole server offline.
process.on('unhandledRejection', (reason) => {
  console.error('[server] unhandled rejection:', reason?.message || reason);
});
