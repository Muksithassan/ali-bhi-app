import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, IS_LOCAL_API } from '../config/env';

// A free hosting tier (Render/Railway) sleeps after a period of inactivity and
// can take up to a minute to wake up, so the timeout has to be generous.
// Anything shorter shows a false "server not reachable" on the first request.
export const REQUEST_TIMEOUT_MS = 60000;

const api = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT_MS,
});

// Intercept requests to add the Auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Attach a human-readable message when the server itself could not be reached
// (no response at all). Without this the UI only ever sees "Network Error" and
// wrongly reports bad credentials.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error);
    }

    const timedOut =
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT' ||
      /timeout/i.test(error.message || '');

    const base = timedOut
      ? `The server at ${API_URL} did not respond within ${Math.round(REQUEST_TIMEOUT_MS / 1000)}s.`
      : `Server is not reachable at ${API_URL}.`;

    const hint = IS_LOCAL_API
      ? 'Check that the backend is running (npm run dev inside server/), that your phone is on the same Wi-Fi as the PC, and that Windows Firewall allows inbound TCP on that port.'
      : `If this is a free hosting plan the server may be waking up - open ${API_URL.replace(/\/api\/?$/, '')}/health in a browser and try again.`;

    error.friendlyMessage = `${base} ${hint}`;
    return Promise.reject(error);
  }
);

// Extracts the most useful message from an axios error.
export function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.friendlyMessage ||
    error?.message ||
    fallback
  );
}

export default api;
