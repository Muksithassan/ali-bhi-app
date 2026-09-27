import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CustomerQuotesScreen({ navigation }) {
  const [projectType, setProjectType] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [location, setLocation] = useState('');
  const [requirements, setRequirements] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Dark Navy Header */}
      <View style={styles.header}>
        {/* If this is accessed via Tab, back button might not be needed, but adding it for exact UI match */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.canGoBack() && navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Get a Quote</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Main Content with Top Rounded Corners */}
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContent}>
          
          <Text style={styles.inputLabel}>Project Type</Text>
          <TouchableOpacity style={styles.dropdownInput}>
            <Text style={styles.dropdownText}>
              {projectType ? projectType : 'Select project type'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#A0AEC0" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Area / Size</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter area (sq. ft)"
            placeholderTextColor="#A0AEC0"
            value={areaSize}
            onChangeText={setAreaSize}
          />

          <Text style={styles.inputLabel}>Location</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your location"
            placeholderTextColor="#A0AEC0"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.inputLabel}>Requirements</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Briefly describe your requirements..."
            placeholderTextColor="#A0AEC0"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            value={requirements}
            onChangeText={setRequirements}
          />

          <Text style={styles.inputLabel}>Upload Documents (Optional)</Text>
          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="document-text" size={32} color="#007BFF" />
            <Text style={styles.uploadText}>Tap to upload (PDF, Images)</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* Submit Button Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Submit Request</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002B5B', // Dark Navy background for header
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
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#002B5B',
    marginBottom: 8,
    marginTop: 15,
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#FFF',
  },
  dropdownText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#FFF',
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
    height: 100,
    backgroundColor: '#FFF',
    fontSize: 14,
    color: '#333',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 10,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    marginTop: 5,
  },
  uploadText: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  submitBtn: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
