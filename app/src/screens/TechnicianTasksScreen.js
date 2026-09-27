import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const MANUAL_TASKS = [
  { id: '1', title: 'Buy AC Gas Cylinder', time: '08:00 AM - 09:00 AM', status: 'pending' },
  { id: '2', title: 'Pick up spare PCB boards', time: '01:00 PM - 02:00 PM', status: 'pending' },
];

export default function TechnicianTasksScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>July 2026 ⌄</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="calendar-outline" size={24} color="#FFE5B4" />
        </TouchableOpacity>
      </View>

      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {/* Horizontal Dates */}
        <View style={styles.datesRow}>
          {['Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map((day, i) => (
            <View key={i} style={styles.dateCol}>
              <Text style={styles.dayText}>{day}</Text>
              <View style={[styles.dateCircle, i === 3 && styles.dateCircleActive]}>
                <Text style={[styles.dateText, i === 3 && styles.dateTextActive]}>{13 + i}</Text>
              </View>
            </View>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.timelineHeader}>TODAY'S TIMELINE</Text>
          
          <View style={styles.timelineContainer}>
            {/* Timeline Line */}
            <View style={styles.timelineLine} />

            {/* Task 1 */}
            <View style={styles.timelineRow}>
              <View style={styles.timeDot} />
              <View style={styles.taskCard}>
                <Text style={styles.taskTime}>10:00 AM - 12:00 PM</Text>
                <Text style={styles.taskTitle}>Deep Cleaning (Assigned)</Text>
              </View>
            </View>

            {/* Break / Manual Task */}
            <View style={styles.timelineRow}>
              <View style={[styles.timeDot, { backgroundColor: '#FF6B6B' }]} />
              <View style={[styles.taskCard, styles.manualTaskCard]}>
                <Text style={styles.taskTime}>01:00 PM - 02:00 PM</Text>
                <Text style={styles.taskTitle}>Buy AC Gas Cylinder</Text>
              </View>
            </View>
            
            {/* Task 2 */}
            <View style={styles.timelineRow}>
              <View style={styles.timeDot} />
              <View style={styles.taskCard}>
                <Text style={styles.taskTime}>02:00 PM - 04:00 PM</Text>
                <Text style={styles.taskTitle}>Gas Charging (Assigned)</Text>
              </View>
            </View>

          </View>
          
          <View style={{ height: 100 }} /> 
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Light background
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  dateCol: {
    alignItems: 'center',
  },
  dayText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateTextActive: {
    color: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  timelineHeader: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 20,
  },
  timelineLine: {
    position: 'absolute',
    left: 4,
    top: 10,
    bottom: 0,
    width: 2,
    backgroundColor: '#E2E8F0',
  },
  timelineRow: {
    position: 'relative',
    marginBottom: 30,
  },
  timeDot: {
    position: 'absolute',
    left: -20,
    top: 15,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#F7F9FC',
  },
  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  manualTaskCard: {
    borderStyle: 'dashed',
    borderColor: '#AAA',
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  taskTime: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
  taskTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  }
});
