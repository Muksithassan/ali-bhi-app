import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function VectorIllustration({ variant = 'welcome' }) {
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createFloatAnimation = (animValue, duration, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -10,
            duration: duration,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatAnimation(floatAnim1, 2000, 0).start();
    createFloatAnimation(floatAnim2, 2500, 500).start();
    createFloatAnimation(floatAnim3, 2200, 1000).start();
  }, [floatAnim1, floatAnim2, floatAnim3]);

  return (
    <View style={styles.container}>
      {/* Central big document/dashboard element */}
      <View style={styles.mainCard}>
        <View style={styles.cardHeader} />
        <View style={styles.cardLine} />
        <View style={styles.cardLine} />
        <View style={styles.cardLineShort} />
      </View>

      {/* Floating Elements */}
      <Animated.View style={[styles.floatingElement, styles.pos1, { transform: [{ translateY: floatAnim1 }] }]}>
        <Ionicons name="settings-outline" size={32} color={colors.surface} />
      </Animated.View>

      <Animated.View style={[styles.floatingElement, styles.pos2, { transform: [{ translateY: floatAnim2 }] }]}>
        <Ionicons name="bar-chart-outline" size={28} color={colors.surface} />
      </Animated.View>

      <Animated.View style={[styles.floatingElement, styles.pos3, { transform: [{ translateY: floatAnim3 }] }]}>
        <Ionicons name="people-outline" size={28} color={colors.surface} />
      </Animated.View>

      {/* Abstract circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    width: 100,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  cardHeader: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 15,
  },
  cardLine: {
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
    marginBottom: 10,
  },
  cardLineShort: {
    height: 6,
    width: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
  },
  floatingElement: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  pos1: {
    top: 10,
    left: 0,
  },
  pos2: {
    bottom: 20,
    right: 10,
  },
  pos3: {
    top: 50,
    right: -10,
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  circle1: {
    width: 120,
    height: 120,
    top: -20,
    right: -30,
    zIndex: -1,
  },
  circle2: {
    width: 80,
    height: 80,
    bottom: -10,
    left: -20,
    zIndex: -1,
  }
});
