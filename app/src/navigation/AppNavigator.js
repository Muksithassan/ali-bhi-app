import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import CustomerStack from './CustomerStack';
import TechnicianStack from './TechnicianStack';
import AdminStack from './AdminStack';
import { AuthContext } from '../context/AuthContext';

import SplashScreen from '../screens/SplashScreen';

export default function AppNavigator() {
  const { isAuthenticated, userRole, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : userRole === 'customer' ? (
        <CustomerStack />
      ) : userRole === 'technician' ? (
        <TechnicianStack />
      ) : (
        <AdminStack />
      )}
    </NavigationContainer>
  );
}
