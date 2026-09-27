import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { getErrorMessage } from '../services/api';
import { registerForPushNotificationsAsync, savePushTokenToBackend } from '../services/pushNotificationService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'customer', 'technician', 'admin'
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token on startup
  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          // Fetch current user data to verify token
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUserData(res.data.user);
            setUserRole(res.data.user.role);
            setIsAuthenticated(true);
            
            // Register for push notifications
            const pushToken = await registerForPushNotificationsAsync();
            if (pushToken) await savePushTokenToBackend(pushToken);
          } else {
            await AsyncStorage.removeItem('userToken');
          }
        }
      } catch (e) {
        console.log('Token check failed:', e);
        // Only sign the user out when the server actually rejected the token.
        // On a network error we keep the token so the user is not logged out
        // just because the server was temporarily unreachable.
        const status = e.response?.status;
        if (status === 401 || status === 403) {
          await AsyncStorage.removeItem('userToken');
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginState();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user } = res.data;
        await AsyncStorage.setItem('userToken', token);
        setUserData(user);
        setUserRole(user.role);
        setIsAuthenticated(true);

        // Register push token
        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken) await savePushTokenToBackend(pushToken);

        return { success: true };
      }
    } catch (e) {
      console.log('Login error:', e.response?.data || e.message);
      return { 
        success: false, 
        message: getErrorMessage(e, 'Login failed. Please check your credentials.') 
      };
    }
  };

  const signup = async (name, email, password, phone = '') => {
    try {
      const res = await api.post('/auth/signup', { name, email, password, phone });
      if (res.data.success) {
        const { token, user } = res.data;
        await AsyncStorage.setItem('userToken', token);
        setUserData(user);
        setUserRole(user.role); // should be 'customer' by default
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (e) {
      console.log('Signup error:', e.response?.data || e.message);
      return { 
        success: false, 
        message: getErrorMessage(e, 'Signup failed. Please try again.') 
      };
    }
  }

  const googleLogin = async (idToken) => {
    try {
      const res = await api.post('/auth/google', { idToken });
      if (res.data.success) {
        const { token, user } = res.data;
        await AsyncStorage.setItem('userToken', token);
        setUserData(user);
        setUserRole(user.role);
        setIsAuthenticated(true);

        // Register push token
        const pushToken = await registerForPushNotificationsAsync();
        if (pushToken) await savePushTokenToBackend(pushToken);

        return { success: true };
      }
    } catch (e) {
      console.log('Google Login error:', e.response?.data || e.message);
      return { 
        success: false, 
        message: getErrorMessage(e, 'Google Login failed.') 
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsAuthenticated(false);
      setUserRole(null);
      setUserData(null);
    } catch (e) {
      console.log('Logout error:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userData, isLoading, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

