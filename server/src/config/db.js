const mongoose = require('mongoose');

const READY_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/** Current connection state, used by the /health endpoint. */
function dbStatus() {
  const { readyState, name } = mongoose.connection;
  return {
    connected: readyState === 1,
    readyState,
    state: READY_STATES[readyState] || 'unknown',
    name: name || null,
  };
}

/**
 * Turns a raw driver error into something the person reading the logs can act
 * on. The most common failure by far is Atlas refusing a host that is not on
 * the cluster's IP access list.
 */
function dbErrorHint(err) {
  const message = String(err?.message || '');

  if (/whitelist|not whitelisted|could not connect to any servers|ETIMEDOUT|ECONNREFUSED/i.test(message)) {
    return [
      'MongoDB Atlas refused this connection.',
      'Fix it in the Atlas dashboard: Network Access -> IP Access List -> Add IP Address.',
      '  - Local development: add your current public IP (or 0.0.0.0/0 while developing).',
      '  - Render: the free tier has no static outbound IP, so allow 0.0.0.0/0',
      '    (or add Render\'s static outbound IPs if your plan provides them).',
      'Docs: https://www.mongodb.com/docs/atlas/security-whitelist/',
    ].join('\n   ');
  }

  if (/bad auth|authentication failed/i.test(message)) {
    return 'Check the username/password inside MONGODB_URI (and URL-encode special characters).';
  }

  if (/ENOTFOUND|querySrv|getaddrinfo/i.test(message)) {
    return 'The cluster hostname in MONGODB_URI could not be resolved. Copy the string again from Atlas -> Connect -> Drivers.';
  }

  return '';
}

const RETRY_BASE_MS = 2000;
const MAX_RETRY_MS = 30000;

/**
 * Connects to MongoDB Atlas using MONGODB_URI.
 *
 * Atlas can briefly refuse connections (cold start, freshly saved IP access
 * list) and hosting platforms kill the whole deploy if the process exits, so
 * this retries with exponential backoff instead of crashing.
 *
 * `retries` may be a finite number (scripts, tests) or `Infinity` (default) so
 * a server keeps trying until the IP whitelist is fixed.
 */
async function connectDB(uri = process.env.MONGODB_URI, retries = Infinity) {
  if (!uri) {
    throw new Error(
      'MONGODB_URI is missing. Copy server/.env.example to server/.env and set it (and add the same variable in the Render dashboard for deploys).'
    );
  }

  mongoose.set('strictQuery', true);

  const bounded = Number.isFinite(retries);
  let attempt = 0;

  for (;;) {
    attempt += 1;
    try {
      // eslint-disable-next-line no-await-in-loop
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      });
      // eslint-disable-next-line no-console
      console.log(`[db] connected to MongoDB (${mongoose.connection.name})`);
      return mongoose.connection;
    } catch (err) {
      const label = bounded ? `${attempt}/${retries}` : `${attempt}`;
      // eslint-disable-next-line no-console
      console.error(`[db] connection attempt ${label} failed: ${err.message}`);

      const hint = dbErrorHint(err);
      // Repeat the hint occasionally so it is still visible in long log tails.
      if (hint && (attempt === 1 || attempt % 5 === 0)) {
        // eslint-disable-next-line no-console
        console.error(`[db] ${hint}`);
      }

      if (bounded && attempt >= retries) throw err;

      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, Math.min(RETRY_BASE_MS * attempt, MAX_RETRY_MS)));
    }
  }
}

module.exports = { connectDB, dbStatus, dbErrorHint };
