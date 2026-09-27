import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, IS_LOCAL_API } from '../config/env';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
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

    const base = `Server is not reachable at ${API_URL}.`;
    const hint = IS_LOCAL_API
      ? 'Make sure the backend is running on your PC, your phone is on the same Wi-Fi, and the port is not blocked by the firewall.'
      : 'Please check your internet connection and try again.';

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
