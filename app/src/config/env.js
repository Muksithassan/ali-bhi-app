// Central runtime configuration.
//
// Expo inlines every `EXPO_PUBLIC_*` variable at build time, so the same code
// can point at a local server during development and a deployed server in a
// build without editing source.
//
// Set these in `app/.env` for local dev, or as EAS environment variables so
// `eas build` picks them up:
//
//   EXPO_PUBLIC_API_URL=http://192.168.1.10:5000/api      (or your deployed URL)
//   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxx.apps.googleusercontent.com
//
// The fallbacks below keep local development working out of the box.

const FALLBACK_API_URL = 'http://192.168.1.10:5000/api';
const FALLBACK_GOOGLE_WEB_CLIENT_ID =
  '245458778051-23rdejm0b384kgqhj7dk392hkeasdfp6.apps.googleusercontent.com';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || FALLBACK_API_URL;

export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || FALLBACK_GOOGLE_WEB_CLIENT_ID;

// True when the app is pointed at a machine on the local network. A build
// shipped to users should never use this — it only works while your PC is
// running the server on the same Wi-Fi.
export const IS_LOCAL_API = /^https?:\/\/(localhost|127\.0\.0\.1|10\.0\.2\.2|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(
  API_URL
);

// A build shipped to users must never point at a machine on the developer's
// Wi-Fi - nobody else could ever reach it. Shout about it instead of failing
// silently with "server not reachable" on every request.
if (typeof __DEV__ !== 'undefined' && !__DEV__ && IS_LOCAL_API) {
  console.warn(
    `[env] This release build points at a local API (${API_URL}). ` +
      'Set EXPO_PUBLIC_API_URL to your deployed server, e.g. https://<your-service>.onrender.com/api, then rebuild.'
  );
}
