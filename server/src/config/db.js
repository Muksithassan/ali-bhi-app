const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas using the MONGODB_URI env var.
 * Retries a few times because Atlas can briefly refuse connections
 * right after a cold start / IP whitelist change.
 */
async function connectDB(uri = process.env.MONGODB_URI, retries = 5) {
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Copy server/.env.example to server/.env and set it.');
  }

  mongoose.set('strictQuery', true);

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      });
      // eslint-disable-next-line no-console
      console.log(`[db] connected to MongoDB (${mongoose.connection.name})`);
      return mongoose.connection;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`[db] connection attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  return mongoose.connection;
}

module.exports = { connectDB };
