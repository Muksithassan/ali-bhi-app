import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';

const MORE_OPTIONS = [
  { id: '1', title: 'Customers', icon: 'people-outline', color: '#0066CC', route: 'AdminCustomers' },
  { id: '2', title: 'Services', icon: 'construct-outline', color: '#38A169', route: 'AdminServices' },
  { id: '3', title: 'Settings', icon: 'settings-outline', color: '#718096', route: null },
  { id: '4', title: 'Logout', icon: 'log-out-outline', color: '#FF4757', isLogout: true },
];

export default function AdminMoreScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>More Options</Text>
        <Text style={styles.subtitle}>Manage Customers and View Analytics</Text>
      </View>

      <View style={styles.content}>
        {MORE_OPTIONS.map((opt) => (
          <TouchableOpacity 
            key={opt.id} 
            style={styles.optionCard}
            onPress={() => {
              if (opt.isLogout) logout();
              else if (opt.route) navigation.navigate(opt.route);
            }}
          >
            <View style={[styles.iconBox, { backgroundColor: opt.color + '20' }]}>
              <Ionicons name={opt.icon} size={24} color={opt.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>{opt.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  }
});
