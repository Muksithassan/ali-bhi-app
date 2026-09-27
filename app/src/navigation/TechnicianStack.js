import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TechnicianTabs from './TechnicianTabs';
import TechnicianJobDetailsScreen from '../screens/TechnicianJobDetailsScreen';

const Stack = createNativeStackNavigator();

export default function TechnicianStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TechnicianMain" component={TechnicianTabs} />
      <Stack.Screen name="JobDetails" component={TechnicianJobDetailsScreen} />
    </Stack.Navigator>
  );
}
