import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import CustomerHomeScreen from '../screens/CustomerHomeScreen';
import CustomerServicesScreen from '../screens/CustomerServicesScreen';
import CustomerQuotesScreen from '../screens/CustomerQuotesScreen';
import CustomerRequestsScreen from '../screens/CustomerRequestsScreen';
import CustomerProfileScreen from '../screens/CustomerProfileScreen';
import DummyCustomerScreen from '../screens/DummyCustomerScreen';
// We will replace DummyCustomerScreen with actual screens as we build them

const Tab = createBottomTabNavigator();

export default function CustomerTabs() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#002B5B', // Deep Navy Blue
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Services') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Requests') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'Quotes') iconName = focused ? 'calculator' : 'calculator-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF', // Bright Blue
        tabBarInactiveTintColor: '#A0AEC0', // Light Gray
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        }
      })}
    >
      <Tab.Screen name="Home" component={CustomerHomeScreen} />
      <Tab.Screen name="Services" component={CustomerServicesScreen} />
      <Tab.Screen name="Requests" component={CustomerRequestsScreen} />
      <Tab.Screen name="Quotes" component={CustomerQuotesScreen} />
      <Tab.Screen name="Profile" component={CustomerProfileScreen} />
    </Tab.Navigator>
  );
}
