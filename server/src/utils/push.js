const Notification = require('../models/Notification');

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * Sends push messages through the Expo push service.
 * Expo accepts up to 100 messages per request.
 */
async function sendExpoPush(messages) {
  const valid = messages.filter((m) => m.to && m.to.startsWith('ExponentPushToken'));
  if (valid.length === 0) return { sent: 0 };

  try {
    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(valid),
    });
    const json = await res.json();
    return { sent: valid.length, result: json };
  } catch (err) {
    // Push failures must never break the API request that triggered them.
    // eslint-disable-next-line no-console
    console.error('[push] failed to send Expo push:', err.message);
    return { sent: 0, error: err.message };
  }
}

/**
 * Persists an in-app notification and pushes it to the user's device.
 * `user` may be a populated User document or a plain object with _id/expoPushToken.
 */
async function notifyUser(user, { title, body, type = 'general', booking, data = {} }) {
  if (!user?._id) return null;

  const notification = await Notification.create({
    user: user._id,
    title,
    body,
    type,
    booking,
    data,
  });

  if (user.expoPushToken) {
    await sendExpoPush([
      {
        to: user.expoPushToken,
        sound: 'default',
        title,
        body,
        data: { ...data, type, bookingId: booking ? String(booking) : undefined },
      },
    ]);
  }

  return notification;
}

/** Notify several users at once. */
async function notifyUsers(users, payload) {
  return Promise.all(users.filter(Boolean).map((u) => notifyUser(u, payload)));
}

module.exports = { sendExpoPush, notifyUser, notifyUsers };
