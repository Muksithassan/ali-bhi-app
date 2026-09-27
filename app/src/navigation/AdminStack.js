import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminTabs from './AdminTabs';
import AdminCustomersScreen from '../screens/AdminCustomersScreen';
import AdminServicesScreen from '../screens/AdminServicesScreen';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminMain" component={AdminTabs} />
      <Stack.Screen name="AdminCustomers" component={AdminCustomersScreen} />
      <Stack.Screen name="AdminServices" component={AdminServicesScreen} />
    </Stack.Navigator>
  );
}
