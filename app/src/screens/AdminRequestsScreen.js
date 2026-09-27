import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Dimensions, LayoutAnimation, Platform, UIManager, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import api from '../services/api';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TABS = ['Service Requests', 'Product Purchases'];

export default function AdminRequestsScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const scrollViewRef = useRef(null);
  const [assigningId, setAssigningId] = useState(null);
  
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, techRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/technicians')
      ]);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
      if (techRes.data.success) setTechnicians(techRes.data.technicians);
    } catch (e) {
      console.log('Error fetching Admin Requests Data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (index) => {
    setActiveTab(index);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (activeTab !== index) {
      setActiveTab(index);
    }
  };

  const toggleAssign = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAssigningId(assigningId === id ? null : id);
  };

  const assignTechnician = async (bookingId, technicianId) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/assign`, { technicianIds: [technicianId] });
      if (res.data.success) {
        Alert.alert('Success', 'Technician assigned');
        setAssigningId(null);
        fetchData();
      }
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to assign technician');
    }
  };

  const renderTicket = (booking) => {
    const isAssigning = assigningId === booking._id;
    const isService = true; // For now all bookings are services in this UI model
    const dateStr = booking.scheduledDate ? new Date(booking.scheduledDate).toDateString() : 'N/A';

    return (
      <View key={booking._id} style={styles.ticketCard}>
        {/* Top Half */}
        <View style={styles.ticketTop}>
          <View style={styles.ticketHeaderRow}>
            <Text style={styles.serviceName}>{booking.serviceName || booking.service?.name}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{booking.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.customerName}>Customer: {booking.customer?.name || 'Unknown'}</Text>
          <Text style={styles.unitsText}>{booking.units} Units</Text>
        </View>

        {/* Dashed Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.cutoutLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.cutoutRight} />
        </View>

        {/* Bottom Half */}
        <View style={styles.ticketBottom}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#888" />
            <Text style={styles.infoText}>{dateStr}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#888" />
            <Text style={styles.infoText}>{booking.timeSlot}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#888" />
            <Text style={styles.infoText}>{booking.address}</Text>
          </View>

          {isService && booking.status === 'pending' && (
            <TouchableOpacity style={styles.assignBtn} onPress={() => toggleAssign(booking._id)}>
              <Text style={styles.assignBtnText}>Assign Technician</Text>
              <Ionicons name={isAssigning ? "chevron-up" : "chevron-down"} size={16} color="#FFF" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          )}

          {isService && booking.status !== 'pending' && booking.technicians?.length > 0 && (
            <View style={styles.assignedTechView}>
              <Ionicons name="person-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.assignedTechText}>Assigned to {booking.technicians[0].name}</Text>
            </View>
          )}

          {/* Accordion Tech List */}
          {isAssigning && isService && booking.status === 'pending' && (
            <View style={styles.techListWrapper}>
              <Text style={styles.techListHeader}>Available Technicians</Text>
              {technicians.map(tech => (
                <View key={tech._id} style={styles.techRow}>
                  <Text style={styles.techName}>{tech.name}</Text>
                  <TouchableOpacity style={styles.quickAssignBtn} onPress={() => assignTechnician(booking._id, tech._id)}>
                    <Text style={styles.quickAssignText}>Assign</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {technicians.length === 0 && <Text style={{color: '#888'}}>No technicians found</Text>}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
        <Text style={styles.subtitle}>Overview & Dispatch</Text>
      </View>

      {/* Custom Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map((tab, index) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabPill, activeTab === index && styles.tabPillActive]}
              onPress={() => handleTabPress(index)}
            >
              <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Swipeable Pages */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.pager}
      >
        {TABS.map((tab, index) => {
          // For now all requests are considered 'Service Requests' in MVP
          const tabBookings = index === 0 ? bookings : []; 
          return (
            <View key={tab} style={styles.page}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageScrollContent}>
                {loading ? (
                  <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
                ) : tabBookings.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="file-tray-outline" size={48} color="#CCC" />
                    <Text style={styles.emptyText}>No {tab.toLowerCase()} found.</Text>
                  </View>
                ) : (
                  tabBookings.map(renderTicket)
                )}
                <View style={{ height: 100 }} />
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Light background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
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
  tabContainer: {
    marginBottom: 10,
  },
  tabScroll: {
    paddingHorizontal: 15,
  },
  tabPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#FFF',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontWeight: '600',
    color: '#888',
  },
  tabTextActive: {
    color: '#FFF',
  },
  pager: {
    flex: 1,
  },
  page: {
    width: width,
    flex: 1,
  },
  pageScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    color: '#888',
    fontSize: 16,
  },
  ticketCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  ticketTop: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusBadge: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  unitsText: {
    fontSize: 13,
    color: '#888',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  cutoutLeft: {
    width: 15,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F7F9FC', // matches background to look like a cutout
    marginLeft: -15,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginHorizontal: 10,
  },
  cutoutRight: {
    width: 15,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F7F9FC',
    marginRight: -15,
  },
  ticketBottom: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  assignBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  assignBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  assignedTechView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F4F8',
  },
  assignedTechText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 8,
  },
  techListWrapper: {
    marginTop: 15,
    backgroundColor: '#F7F9FC',
    padding: 15,
    borderRadius: 10,
  },
  techListHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 10,
  },
  techRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  techName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  quickAssignBtn: {
    backgroundColor: '#2F855A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  quickAssignText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
