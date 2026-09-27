import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

// Simple custom hook/component for counting numbers
const AnimatedCounter = ({ endValue, duration = 1000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: endValue,
      duration: duration,
      useNativeDriver: false, // We need to listen to value changes
    }).start();

    animValue.addListener((v) => {
      setCount(Math.floor(v.value));
    });

    return () => {
      animValue.removeAllListeners();
    };
  }, []);

  return <Text style={styles.statValue}>{prefix}{count.toLocaleString()}{suffix}</Text>;
};

export default function AdminDashboardScreen() {
  // Chart Animation
  const chartBars = [40, 70, 45, 90, 60, 110, 85]; // representing heights
  const barAnims = useRef(chartBars.map(() => new Animated.Value(0))).current;

  // List Animation
  const listOpacity = useRef(new Animated.Value(0)).current;
  const listTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Staggered Bar Chart growth
    const anims = barAnims.map((anim, index) => 
      Animated.timing(anim, {
        toValue: chartBars[index],
        duration: 500,
        useNativeDriver: false,
      })
    );
    Animated.stagger(50, anims).start();

    // Slide up recent activity
    Animated.parallel([
      Animated.timing(listOpacity, { toValue: 1, duration: 600, delay: 500, useNativeDriver: true }),
      Animated.timing(listTranslateY, { toValue: 0, duration: 600, delay: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Admin Panel</Text>
          <Text style={styles.subtitle}>Overview & Analytics</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Metric Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
            <Ionicons name="time-outline" size={24} color={colors.surface} />
            <Text style={styles.statLabelLight}>Pending Requests</Text>
            <AnimatedCounter endValue={12} prefix="" />
          </View>

          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color={colors.primary} />
            <Text style={styles.statLabel}>Customers</Text>
            <AnimatedCounter endValue={845} />
          </View>

          <View style={styles.statCard}>
            <Ionicons name="construct-outline" size={24} color={colors.primary} />
            <Text style={styles.statLabel}>Technicians</Text>
            <AnimatedCounter endValue={18} />
          </View>

          <View style={[styles.statCard, { backgroundColor: '#2F855A' }]}>
            <Ionicons name="document-text-outline" size={24} color={colors.surface} />
            <Text style={styles.statLabelLight}>Active AMCs</Text>
            <AnimatedCounter endValue={42} />
          </View>
        </ScrollView>

        {/* Revenue Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Revenue Overview</Text>
            <Text style={styles.growthText}>+12.5%</Text>
          </View>
          
          <View style={styles.chartCard}>
            <Text style={styles.chartTotal}>Rs 2,450,000</Text>
            <Text style={styles.chartSub}>Total Earnings</Text>
            
            <View style={styles.mockChartArea}>
              <View style={[styles.mockBar, { height: 40 }]} />
              <View style={[styles.mockBar, { height: 70 }]} />
              <View style={[styles.mockBar, { height: 45 }]} />
              <View style={[styles.mockBar, { height: 90 }]} />
              <View style={[styles.mockBar, { height: 60 }]} />
              <View style={[styles.mockBar, { height: 110 }]} />
              <View style={[styles.mockBar, { height: 85, backgroundColor: colors.primary }]} />
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabelText}>Mon</Text>
              <Text style={styles.chartLabelText}>Tue</Text>
              <Text style={styles.chartLabelText}>Wed</Text>
              <Text style={styles.chartLabelText}>Thu</Text>
              <Text style={styles.chartLabelText}>Fri</Text>
              <Text style={styles.chartLabelText}>Sat</Text>
              <Text style={styles.chartLabelText}>Sun</Text>
            </View>
          </View>
        </View>

        {/* Top Performers */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Top Performers</Text>
            <TouchableOpacity><Text style={styles.seeAll}>View All</Text></TouchableOpacity>
          </View>

          <View style={styles.listCard}>
            <View style={styles.listItem}>
              <View style={styles.rankBadge}><Text style={styles.rankText}>1</Text></View>
              <View style={styles.listAvatar}><Text style={styles.listAvatarText}>AH</Text></View>
              <View style={styles.listInfo}>
                <Text style={styles.listName}>Ali Hassan</Text>
                <Text style={styles.listSub}>42 Jobs Completed</Text>
              </View>
              <Text style={styles.listAmount}>Rs 45K</Text>
            </View>
            
            <View style={[styles.listItem, { borderBottomWidth: 0 }]}>
              <View style={[styles.rankBadge, { backgroundColor: '#CBD5E0' }]}><Text style={styles.rankText}>2</Text></View>
              <View style={styles.listAvatar}><Text style={styles.listAvatarText}>BK</Text></View>
              <View style={styles.listInfo}>
                <Text style={styles.listName}>Bilal Khan</Text>
                <Text style={styles.listSub}>38 Jobs Completed</Text>
              </View>
              <Text style={styles.listAmount}>Rs 39K</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <Animated.View style={{ opacity: listOpacity, transform: [{ translateY: listTranslateY }], paddingHorizontal: 20 }}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Requests</Text>
            <Text style={styles.seeAll}>View All</Text>
          </View>

          {[
            { id: '1', title: 'Deep Cleaning (2 Units)', customer: 'John Doe', time: '10 mins ago', status: 'Pending', color: '#FF9800' },
            { id: '2', title: 'Product Purchase - 1.5 Ton AC', customer: 'Ahmed R.', time: '1 hour ago', status: 'Completed', color: '#2F855A' },
            { id: '3', title: 'Gas Charging (1 Unit)', customer: 'Sara K.', time: '3 hours ago', status: 'Assigned', color: '#007BFF' },
          ].map((item, index) => (
            <View key={index} style={styles.activityCard}>
              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.status === 'Completed' ? "checkmark-circle" : "time"} size={24} color={item.color} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activitySub}>{item.customer} • {item.status}</Text>
              </View>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          ))}
        </Animated.View>
        
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
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
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  statsScroll: {
    overflow: 'visible',
    marginBottom: 30,
  },
  statCard: {
    width: 150,
    height: 150,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginRight: 15,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 15,
  },
  statLabelLight: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 15,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  chartSection: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  growthText: {
    color: '#2F855A',
    fontWeight: 'bold',
    backgroundColor: '#E2FBE9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
  },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  chartTotal: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  chartSub: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
  mockChartArea: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
    paddingBottom: 10,
  },
  mockBar: {
    width: 30,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chartLabelText: {
    fontSize: 11,
    color: '#A0AEC0',
    width: 30,
    textAlign: 'center',
  },
  listCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ECC94B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listAvatarText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  listSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  listAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2F855A',
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityIcon: {
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  activitySub: {
    fontSize: 12,
    color: '#888',
  },
  activityTime: {
    fontSize: 12,
    color: '#AAA',
    marginLeft: 10,
  }
});
