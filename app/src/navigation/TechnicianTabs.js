import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Text, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TechnicianJobsScreen from '../screens/TechnicianJobsScreen';
import TechnicianTasksScreen from '../screens/TechnicianTasksScreen';
import TechnicianProfileScreen from '../screens/TechnicianProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Dummy component for Profile
const DummyScreen = () => <View style={{ flex: 1, backgroundColor: '#111315' }} />;

function CustomTabBar({ state, descriptors, navigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;
    Animated.parallel([
      Animated.spring(spinAnim, { toValue, useNativeDriver: true }),
      Animated.spring(menuAnim, { toValue, friction: 5, useNativeDriver: true })
    ]).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg']
  });

  const menuTranslateY = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  });

  return (
    <View style={styles.tabBarContainer}>
      
      {/* Floating Add Task Menu (Slides up from behind bar) */}
      <Animated.View style={[styles.floatingMenu, { transform: [{ translateY: menuTranslateY }], opacity: menuAnim }]}>
        <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate('Tasks'); }}>
          <Ionicons name="create-outline" size={20} color={colors.primary} />
          <Text style={styles.menuText}>Add Manual Task</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          if (route.name === 'Add') {
            return (
              <View key={route.key} style={styles.fabWrapper}>
                <TouchableOpacity activeOpacity={0.8} onPress={toggleMenu}>
                  <Animated.View style={[styles.fab, { transform: [{ rotate: spin }] }]}>
                    <Ionicons name="add" size={32} color="#FFF" />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            );
          }

          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName;
          if (route.name === 'Jobs') iconName = isFocused ? 'home' : 'home-outline';
          else if (route.name === 'Tasks') iconName = isFocused ? 'list' : 'list-outline';
          else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline';

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem}>
              <Ionicons name={iconName} size={24} color={isFocused ? colors.primary : '#888'} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TechnicianTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Jobs" component={TechnicianJobsScreen} />
      <Tab.Screen name="Tasks" component={TechnicianTasksScreen} /> 
      <Tab.Screen name="Add" component={DummyScreen} />
      <Tab.Screen name="Profile" component={TechnicianProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#FFF', // Light mode tab bar
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  fabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: -25,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary, // Using brand primary instead of peach
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingMenu: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuText: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: colors.textPrimary,
  }
});
