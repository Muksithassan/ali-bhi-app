import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function TechnicianJobDetailsScreen({ route, navigation }) {
  const { job } = route.params || { job: { id: '0', title: 'Sample Job', address: 'Unknown', time: 'N/A', date: 'N/A' } };
  const [status, setStatus] = useState('In Progress');
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  // Dummy image toggles
  const handleUploadBefore = () => setBeforeImage('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=300');
  const handleUploadAfter = () => setAfterImage('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=300');

  const handleComplete = () => {
    setStatus('Completed');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Job Info Card */}
        <View style={styles.card}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{status}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#A0AEC0" />
            <Text style={styles.infoText}>{job.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#A0AEC0" />
            <Text style={styles.infoText}>{job.time}  |  {job.date}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionHeading}>Customer Details</Text>
          <View style={styles.customerRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>JD</Text></View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>John Doe</Text>
              <Text style={styles.customerPhone}>+92 300 1234567</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Requirements Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Job Requirements</Text>
          <Text style={styles.descText}>
            The customer has requested a complete deep cleaning of 2 split AC units. 
            Ensure gas pressure is checked and filters are replaced if necessary.
          </Text>
        </View>

        {/* Picture Upload Section */}
        <Text style={styles.uploadTitle}>Work Proof (Before / After)</Text>
        <View style={styles.uploadContainer}>
          
          <TouchableOpacity style={styles.uploadBox} onPress={handleUploadBefore}>
            {beforeImage ? (
              <Image source={{ uri: beforeImage }} style={styles.uploadedImg} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={32} color="#A0AEC0" />
                <Text style={styles.uploadText}>Before</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadBox} onPress={handleUploadAfter}>
            {afterImage ? (
              <Image source={{ uri: afterImage }} style={styles.uploadedImg} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={32} color="#A0AEC0" />
                <Text style={styles.uploadText}>After</Text>
              </>
            )}
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.completeBtn, (!beforeImage || !afterImage) && { opacity: 0.5 }]} 
          disabled={!beforeImage || !afterImage}
          onPress={handleComplete}
        >
          <Text style={styles.completeBtnText}>Mark as Completed</Text>
          <Ionicons name="checkmark-done" size={20} color="#FFF" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002B5B', // Dark Navy
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#0F3A68',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  jobTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(47, 133, 90, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    color: '#48BB78',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    color: '#E2E8F0',
    fontSize: 14,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 15,
  },
  sectionHeading: {
    color: '#A0AEC0',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  customerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  customerName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerPhone: {
    color: '#A0AEC0',
    fontSize: 13,
    marginTop: 2,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 22,
  },
  uploadTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadBox: {
    width: '48%',
    height: 120,
    backgroundColor: '#0F3A68',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadText: {
    color: '#A0AEC0',
    fontSize: 13,
    marginTop: 8,
    fontWeight: 'bold',
  },
  uploadedImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#0F3A68',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  completeBtn: {
    backgroundColor: '#2F855A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  completeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
