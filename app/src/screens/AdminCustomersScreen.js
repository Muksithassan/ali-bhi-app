import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const DEMO_CUSTOMERS = [
  { id: '1', name: 'Meezan Bank Ltd', type: 'Corporate', initial: 'MB', sector: 'Banking', activeContracts: 3, value: '$12,500', color: '#002B5B' },
  { id: '2', name: 'Agha Khan Hospital', type: 'Corporate', initial: 'AK', sector: 'Healthcare', activeContracts: 1, value: '$8,200', color: '#2F855A' },
  { id: '3', name: 'John Doe', type: 'Residential', initial: 'JD', sector: 'Home', activeContracts: 0, value: '$450', color: '#007BFF' },
  { id: '4', name: 'Zimplex IT Solutions', type: 'Corporate', initial: 'ZI', sector: 'IT Services', activeContracts: 2, value: '$4,100', color: '#D53F8C' },
  { id: '5', name: 'Sara K.', type: 'Residential', initial: 'SK', sector: 'Home', activeContracts: 1, value: '$950', color: '#FF9800' },
];

export default function AdminCustomersScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = DEMO_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Customers</Text>
          <Text style={styles.subtitle}>Client Management</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search by name or type..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats Quick View */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>142</Text>
          <Text style={styles.statLabel}>Total Clients</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>28</Text>
          <Text style={styles.statLabel}>Corporate</Text>
        </View>
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredCustomers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No customers found.</Text>
          </View>
        ) : (
          filteredCustomers.map(customer => (
            <TouchableOpacity key={customer.id} style={styles.customerCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: customer.color + '20' }]}>
                  <Text style={[styles.avatarText, { color: customer.color }]}>{customer.initial}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.nameText}>{customer.name}</Text>
                  <Text style={styles.typeText}>{customer.type} • {customer.sector}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
              </View>
              
              <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                  <Text style={styles.footerLabel}>Active Contracts</Text>
                  <Text style={styles.footerValue}>{customer.activeContracts}</Text>
                </View>
                <View style={styles.footerItemRight}>
                  <Text style={styles.footerLabel}>Lifetime Value</Text>
                  <Text style={[styles.footerValue, { color: colors.primary }]}>{customer.value}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#002B5B',
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
    justifyContent: 'center',
  },
  statNum: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  customerCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCol: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 12,
    color: '#888',
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
    paddingTop: 15,
  },
  footerItem: {
    flex: 1,
  },
  footerItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footerLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 15,
    color: '#888',
    fontSize: 16,
  },
});
