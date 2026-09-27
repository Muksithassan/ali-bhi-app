import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminTechniciansScreen from '../screens/AdminTechniciansScreen';
import AdminRequestsScreen from '../screens/AdminRequestsScreen';
import AdminProductsScreen from '../screens/AdminProductsScreen';
import AdminMoreScreen from '../screens/AdminMoreScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          else if (route.name === 'Requests') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Techs') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Products') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'More') iconName = focused ? 'menu' : 'menu-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60 }
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Requests" component={AdminRequestsScreen} />
      <Tab.Screen name="Techs" component={AdminTechniciansScreen} />
      <Tab.Screen name="Products" component={AdminProductsScreen} />
      <Tab.Screen name="More" component={AdminMoreScreen} />
    </Tab.Navigator>
  );
}
