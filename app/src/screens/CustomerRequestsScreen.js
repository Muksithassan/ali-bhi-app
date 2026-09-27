import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const TABS = ['All', 'pending', 'assigned', 'in-progress', 'completed'];

export default function CustomerRequestsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (e) {
      console.log('Error fetching bookings:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = activeTab === 'All' 
    ? bookings 
    : bookings.filter(r => r.status === activeTab);

  const getStatusColor = (status) => {
    switch(status) {
      case 'in-progress': return { bg: '#EBF4FF', text: '#007BFF' }; // Light Blue
      case 'completed': return { bg: '#E6FFFA', text: '#38B2AC' }; // Light Green
      case 'pending': return { bg: '#FFF5F5', text: '#E53E3E' }; // Light Red
      case 'assigned': return { bg: '#FEFCBF', text: '#D69E2E' }; // Light Yellow
      default: return { bg: '#F7FAFC', text: '#718096' };
    }
  };

  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const dateStr = item.scheduledDate ? new Date(item.scheduledDate).toDateString() : 'N/A';

    return (
      <TouchableOpacity style={styles.card}>
        <View style={[styles.cardImage, { justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="construct-outline" size={30} color="#A0AEC0" />
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardId}>{item.bookingNo}</Text>
          <Text style={styles.cardService}>{item.serviceName || item.service?.name}</Text>
          <Text style={styles.cardDate}>{dateStr}</Text>
        </View>

        <View style={styles.cardRight}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusText, { color: statusColor.text }]}>{item.status.toUpperCase()}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#A0AEC0" style={{ marginLeft: 5 }} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.canGoBack() && navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Requests</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        
        {/* Top Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {TABS.map(tab => {
              const isActive = activeTab === tab;
              const displayTab = tab === 'All' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1);
              return (
                <TouchableOpacity 
                  key={tab} 
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{displayTab}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Requests List */}
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={filteredRequests}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No requests found.</Text>
              </View>
            }
          />
        )}

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
  rightPlaceholder: {
    width: 30,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 5,
    overflow: 'hidden',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabsScroll: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabBtnActive: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFF',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 15,
    // Add subtle shadow just in case it looks too flat
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#E2E8F0',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#002B5B',
    marginBottom: 4,
  },
  cardService: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 11,
    color: '#A0AEC0',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyBox: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#A0AEC0',
    fontSize: 14,
  }
});
