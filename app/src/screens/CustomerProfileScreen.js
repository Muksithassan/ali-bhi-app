import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const MENU_OPTIONS = [
  { id: '1', title: 'Personal Information', icon: 'account-outline' },
  { id: '2', title: 'Company Details', icon: 'domain' },
  { id: '3', title: 'Service Addresses', icon: 'map-marker-outline' },
  { id: '4', title: 'Payment Methods', icon: 'credit-card-outline' },
  { id: '5', title: 'Notifications', icon: 'bell-outline' },
  { id: '6', title: 'Support', icon: 'help-circle-outline' },
  { id: '7', title: 'Logout', icon: 'logout', isLogout: true },
];

export default function CustomerProfileScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.canGoBack() && navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.rightBtn}>
          <Ionicons name="settings-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#007BFF" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Hasnain Ali</Text>
              <Text style={styles.userRole}>CEO</Text>
              <Text style={styles.userCompany}>Ali Cool Point (SMC-Private) Limited</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Requests</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Quotes</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>AMC</Text>
            </View>
          </View>

          {/* Menu Options */}
          <View style={styles.menuContainer}>
            {MENU_OPTIONS.map(option => (
              <TouchableOpacity 
                key={option.id} 
                style={styles.menuRow}
                onPress={() => option.isLogout ? logout() : null}
              >
                <View style={styles.menuIconBox}>
                  <MaterialCommunityIcons name={option.icon} size={22} color={option.isLogout ? "#FF4757" : "#002B5B"} />
                </View>
                <Text style={[styles.menuTitle, option.isLogout && { color: '#FF4757' }]}>{option.title}</Text>
                {!option.isLogout && <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />}
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002B5B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#002B5B',
  },
  backBtn: {
    width: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  rightBtn: {
    width: 30,
    alignItems: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 5,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EBF4FF', // Light Blue background for dummy avatar
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002B5B',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 12,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002B5B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: '#FFF',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});
