import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DummyCustomerScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{route.name} Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002B5B'
  }
});
