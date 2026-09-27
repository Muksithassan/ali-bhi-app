import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const { width } = Dimensions.get('window');

const STEPS = [
  { id: 1, label: 'Service\nDetails' },
  { id: 2, label: 'Location' },
  { id: 3, label: 'Schedule' },
  { id: 4, label: 'Confirm' },
];

export default function CustomerBookingScreen({ navigation, route }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1 State
  const [serviceType, setServiceType] = useState(route.params?.service || 'AC Repair');
  const isACService = serviceType.toLowerCase().includes('ac') || serviceType.toLowerCase().includes('installation') || serviceType.toLowerCase().includes('hvac');
  const [acType, setAcType] = useState('Split AC');
  const [units, setUnits] = useState(1);
  const [description, setDescription] = useState('');

  // Step 2 State
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');

  // Step 3 State
  const [selectedDate, setSelectedDate] = useState('2026-10-01'); // Hardcode simple date format for now
  const [selectedTime, setSelectedTime] = useState('10:00-11:00'); // Standardized time slots

  const handleNext = () => {
    if(currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if(currentStep > 1) setCurrentStep(currentStep - 1);
    else navigation.goBack();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const bookingData = {
        serviceName: serviceType,
        acType: isACService ? acType : '',
        units: isACService ? units : 1,
        problem: description,
        address: `${address}, ${area}`,
        scheduledDate: selectedDate,
        timeSlot: selectedTime
      };
      
      const res = await api.post('/bookings', bookingData);
      
      if (res.data.success) {
        Alert.alert('Success', 'Your booking has been requested!', [
          { text: 'OK', onPress: () => navigation.navigate('Requests') }
        ]);
      }
    } catch (e) {
      console.log('Error creating booking:', e.response?.data || e.message);
      Alert.alert('Error', e.response?.data?.message || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Service</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        
        {/* Progress Tracker */}
        <View style={styles.progressContainer}>
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <View key={step.id} style={styles.stepWrapper}>
                <View style={styles.stepCircleRow}>
                  {index !== 0 && (
                     <View style={[styles.stepLine, isCompleted ? styles.stepLineActive : {}]} />
                  )}
                  
                  <View style={[
                    styles.stepCircle, 
                    isActive || isCompleted ? styles.stepCircleActive : {}
                  ]}>
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={16} color="#FFF" />
                    ) : (
                      <Text style={[
                        styles.stepNumber,
                        isActive ? styles.stepNumberActive : {}
                      ]}>{step.id}</Text>
                    )}
                  </View>

                  {index !== STEPS.length - 1 && (
                     <View style={[styles.stepLine, isCompleted ? styles.stepLineActive : {}]} />
                  )}
                </View>
                <Text style={[styles.stepLabel, isActive ? styles.stepLabelActive : {}]}>
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContent}>
          
          {/* STEP 1: SERVICE DETAILS */}
          {currentStep === 1 && (
            <>
              <Text style={styles.inputLabel}>Select Service</Text>
              <TouchableOpacity style={styles.dropdownInput}>
                <Text style={styles.dropdownText}>{serviceType}</Text>
                <Ionicons name="chevron-down" size={20} color="#A0AEC0" />
              </TouchableOpacity>

              {isACService && (
                <>
                  <Text style={styles.inputLabel}>AC Type</Text>
                  <View style={styles.radioGroup}>
                    {['Split AC', 'Window AC', 'Cassette'].map(type => (
                      <TouchableOpacity 
                        key={type} 
                        style={[styles.radioBtn, acType === type && styles.radioBtnActive]}
                        onPress={() => setAcType(type)}
                      >
                        <Text style={[styles.radioText, acType === type && styles.radioTextActive]}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.inputLabel}>Number of Units</Text>
                  <View style={styles.counterRow}>
                    <TouchableOpacity style={styles.counterBtn} onPress={() => units > 1 && setUnits(units - 1)}>
                      <Ionicons name="remove" size={20} color="#002B5B" />
                    </TouchableOpacity>
                    <Text style={styles.counterText}>{units}</Text>
                    <TouchableOpacity style={styles.counterBtn} onPress={() => setUnits(units + 1)}>
                      <Ionicons name="add" size={20} color="#002B5B" />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe the issue (e.g., Not cooling, strange noise)..."
                placeholderTextColor="#A0AEC0"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />

              <Text style={styles.inputLabel}>Upload Images (Optional)</Text>
              <TouchableOpacity style={styles.uploadBox}>
                <Ionicons name="camera" size={32} color="#007BFF" />
                <Text style={styles.uploadText}>Tap to upload images</Text>
              </TouchableOpacity>
            </>
          )}

          {/* STEP 2: LOCATION */}
          {currentStep === 2 && (
            <>
              <View style={styles.mapPlaceholder}>
                <Ionicons name="map-outline" size={40} color="#007BFF" />
                <Text style={styles.mapText}>Tap to Select on Map</Text>
              </View>

              <Text style={styles.inputLabel}>Building / Villa Name or Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Al-Falah Building, Apt 402"
                placeholderTextColor="#A0AEC0"
                value={address}
                onChangeText={setAddress}
              />

              <Text style={styles.inputLabel}>Area / Street</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Gulshan-e-Iqbal, Block 10"
                placeholderTextColor="#A0AEC0"
                value={area}
                onChangeText={setArea}
              />
            </>
          )}

          {/* STEP 3: SCHEDULE */}
          {currentStep === 3 && (
            <>
              <Text style={styles.inputLabel}>Select Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
                {['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'].map(date => (
                  <TouchableOpacity 
                    key={date} 
                    style={[styles.dateCard, selectedDate === date && styles.dateCardActive]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text style={[styles.dateText, selectedDate === date && styles.dateTextActive]}>{date}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Select Time Slot</Text>
              <View style={styles.timeGrid}>
                {['10:00-11:00', '12:00-13:00', '14:00-15:00', '16:00-17:00'].map(time => (
                  <TouchableOpacity 
                    key={time} 
                    style={[styles.timeCard, selectedTime === time && styles.timeCardActive]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* STEP 4: CONFIRM */}
          {currentStep === 4 && (
            <>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Booking Summary</Text>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Service:</Text>
                  <Text style={styles.summaryValue}>{serviceType}</Text>
                </View>
                {isACService && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>AC Details:</Text>
                    <Text style={styles.summaryValue}>{acType} x {units}</Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Schedule:</Text>
                  <Text style={styles.summaryValue}>{selectedDate} at {selectedTime}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Location:</Text>
                  <Text style={styles.summaryValue}>{address ? `${address}, ${area}` : 'Not provided'}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>Estimated Cost:</Text>
                  <Text style={styles.summaryTotalValue}>To be quoted</Text>
                </View>
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color="#007BFF" />
                <Text style={styles.infoText}>Our technician will inspect the units and provide a final quote before starting the work.</Text>
              </View>
            </>
          )}

        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          {currentStep === 4 ? (
            <TouchableOpacity style={styles.nextBtn} onPress={handleSubmit}>
              <Text style={styles.nextBtnText}>Confirm Booking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#002B5B' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#002B5B' },
  backBtn: { width: 30 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  rightPlaceholder: { width: 30 },
  contentContainer: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: 5, overflow: 'hidden' },
  
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  stepWrapper: { alignItems: 'center', flex: 1 },
  stepCircleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E2E8F0' },
  stepLineActive: { backgroundColor: '#007BFF' },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  stepCircleActive: { backgroundColor: '#007BFF' },
  stepNumber: { fontSize: 12, fontWeight: 'bold', color: '#A0AEC0' },
  stepNumberActive: { color: '#FFF' },
  stepLabel: { fontSize: 10, color: '#A0AEC0', marginTop: 8, textAlign: 'center', fontWeight: '600' },
  stepLabelActive: { color: '#007BFF', fontWeight: 'bold' },
  
  formContent: { padding: 20, paddingBottom: 40 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: '#002B5B', marginBottom: 8, marginTop: 20 },
  
  dropdownInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 15, height: 50, backgroundColor: '#FFF' },
  dropdownText: { fontSize: 14, color: '#333' },
  
  radioGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  radioBtn: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, alignItems: 'center', marginRight: 8, backgroundColor: '#FFF' },
  radioBtnActive: { borderColor: '#007BFF', backgroundColor: '#F0F8FF' },
  radioText: { fontSize: 12, color: '#666', fontWeight: '600' },
  radioTextActive: { color: '#007BFF', fontWeight: 'bold' },
  
  counterRow: { flexDirection: 'row', alignItems: 'center' },
  counterBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F4F8', justifyContent: 'center', alignItems: 'center' },
  counterText: { fontSize: 18, fontWeight: 'bold', color: '#002B5B', marginHorizontal: 20 },
  
  textArea: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 15, paddingTop: 15, height: 100, backgroundColor: '#FFF', fontSize: 14, color: '#333' },
  uploadBox: { borderWidth: 1.5, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 10, height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', marginTop: 5 },
  uploadText: { fontSize: 13, color: '#666', marginTop: 10 },
  
  textInput: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 15, height: 50, backgroundColor: '#FFF', fontSize: 14, color: '#333' },
  mapPlaceholder: { height: 150, backgroundColor: '#F0F8FF', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#CCE5FF', marginTop: 10 },
  mapText: { color: '#007BFF', fontWeight: 'bold', marginTop: 10 },

  dateScroll: { flexDirection: 'row', marginBottom: 5 },
  dateCard: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 10, backgroundColor: '#FFF' },
  dateCardActive: { borderColor: '#007BFF', backgroundColor: '#007BFF' },
  dateText: { fontSize: 14, color: '#666', fontWeight: 'bold' },
  dateTextActive: { color: '#FFF' },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  timeCard: { width: '31%', paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10, alignItems: 'center', backgroundColor: '#FFF' },
  timeCardActive: { borderColor: '#007BFF', backgroundColor: '#F0F8FF' },
  timeText: { fontSize: 13, color: '#666', fontWeight: '600' },
  timeTextActive: { color: '#007BFF', fontWeight: 'bold' },

  summaryBox: { backgroundColor: '#F8F9FA', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 10 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#002B5B', marginBottom: 15 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 13, color: '#666' },
  summaryValue: { fontSize: 13, fontWeight: 'bold', color: '#333', textAlign: 'right', flex: 1, marginLeft: 10 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 15 },
  summaryTotalLabel: { fontSize: 15, fontWeight: 'bold', color: '#002B5B' },
  summaryTotalValue: { fontSize: 15, fontWeight: 'bold', color: '#007BFF' },

  infoBox: { flexDirection: 'row', backgroundColor: '#F0F8FF', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  infoText: { flex: 1, fontSize: 12, color: '#002B5B', marginLeft: 10, lineHeight: 18 },

  footer: { paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#FFF' },
  nextBtn: { backgroundColor: '#007BFF', borderRadius: 10, height: 55, justifyContent: 'center', alignItems: 'center' },
  nextBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
