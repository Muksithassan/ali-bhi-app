import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerTabs from './CustomerTabs';
import CustomerBookingScreen from '../screens/CustomerBookingScreen';

import CustomerProductsScreen from '../screens/CustomerProductsScreen';

const Stack = createNativeStackNavigator();

export default function CustomerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
      <Stack.Screen name="BookingFlow" component={CustomerBookingScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Products" component={CustomerProductsScreen} options={{ animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}
