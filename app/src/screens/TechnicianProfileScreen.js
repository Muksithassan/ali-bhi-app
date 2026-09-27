import React, { useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const REVIEWS = [
  { id: '1', name: 'Sara K.', rating: 5, comment: 'Ali was very professional and fixed my AC in no time. Highly recommended!', date: '2 days ago' },
  { id: '2', name: 'John D.', rating: 4, comment: 'Good service, but arrived 10 mins late. Overall satisfied.', date: '1 week ago' },
  { id: '3', name: 'Ahmed R.', rating: 5, comment: 'Deep cleaning was excellent. My AC feels brand new!', date: '2 weeks ago' },
];

export default function TechnicianProfileScreen() {
  const { logout } = useContext(AuthContext);

  // Animations
  const avatarScale = useRef(new Animated.Value(0)).current;
  const statsTranslateY = useRef([new Animated.Value(50), new Animated.Value(50), new Animated.Value(50)]).current;
  const reviewTranslateY = useRef(new Animated.Value(100)).current;
  const reviewOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Avatar Pop
    Animated.spring(avatarScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Stats Bounce Sequence
    const statAnims = statsTranslateY.map(val => 
      Animated.spring(val, {
        toValue: 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, statAnims).start();

    // Reviews Slide Up
    Animated.parallel([
      Animated.timing(reviewTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(reviewOpacity, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header & Avatar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <Animated.View style={[styles.avatarContainer, { transform: [{ scale: avatarScale }] }]}>
            <LinearGradient colors={['#FFE5B4', '#FFA502']} style={styles.avatarGradient}>
              <Text style={styles.avatarText}>A</Text>
            </LinearGradient>
            <View style={styles.onlineDot} />
          </Animated.View>
          <Text style={styles.nameText}>Ali Hassan</Text>
          <Text style={styles.roleText}>Senior AC Technician</Text>
        </View>

        {/* Performance Stats */}
        <View style={styles.statsContainer}>
          <Animated.View style={[styles.statBox, { transform: [{ translateY: statsTranslateY[0] }] }]}>
            <Ionicons name="briefcase-outline" size={24} color="#FFE5B4" />
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Total Jobs</Text>
          </Animated.View>

          <Animated.View style={[styles.statBox, { transform: [{ translateY: statsTranslateY[1] }] }]}>
            <Ionicons name="star-outline" size={24} color="#FFE5B4" />
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </Animated.View>

          <Animated.View style={[styles.statBox, { transform: [{ translateY: statsTranslateY[2] }] }]}>
            <Ionicons name="wallet-outline" size={24} color="#FFE5B4" />
            <Text style={styles.statValue}>$3.2k</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </Animated.View>
        </View>

        {/* Reviews Section */}
        <Animated.View style={{ opacity: reviewOpacity, transform: [{ translateY: reviewTranslateY }] }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reviews</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>

          {REVIEWS.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <View style={styles.starsRow}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons 
                      key={i} 
                      name={i < review.rating ? "star" : "star-outline"} 
                      size={14} 
                      color="#FFE5B4" 
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Padding for custom bottom bar */}
        <View style={{ height: 100 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002B5B', // Dark Navy Theme
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarGradient: {
    flex: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#48BB78',
    borderWidth: 3,
    borderColor: '#002B5B',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  roleText: {
    fontSize: 14,
    color: '#63B3ED',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statBox: {
    width: (width - 60) / 3,
    backgroundColor: '#0F3A68',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#63B3ED',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: '#0F3A68',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  starsRow: {
    flexDirection: 'row',
  },
  reviewComment: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  reviewDate: {
    color: '#A0AEC0',
    fontSize: 12,
  }
});
