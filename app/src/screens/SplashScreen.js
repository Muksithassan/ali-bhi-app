import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ImageBackground, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Loading Bar Animation (Interpolates 0 to 100 width)
    Animated.timing(loadingProgress, {
      toValue: 100, // percentage string mapping
      duration: 3000,
      useNativeDriver: false, // width animation doesn't support native driver
    }).start();

    // Auto navigate to Login after 3.5 seconds if navigation is passed
    const timer = setTimeout(() => {
      if (navigation && navigation.replace) {
        navigation.replace('Login');
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Interpolate for percentage
  const widthAnim = loadingProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <ImageBackground 
      source={require('../../assets/splash-bg.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Animated.View style={{ opacity: logoAnim, transform: [{ scale: logoAnim }] }}>
          <Image 
            source={require('../../assets/acp-logo.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
        </Animated.View>

        <Animated.View style={{ opacity: textAnim, alignItems: 'center', marginTop: 30 }}>
          <Text style={styles.tagline}>Cooler Spaces</Text>
          <Text style={styles.tagline}>Better Lives</Text>
          
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
            <View style={styles.loadingBarBg}>
              <Animated.View style={[styles.loadingBarFill, { width: widthAnim }]} />
            </View>
          </View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.15, // Pushes content down a bit like the design
  },
  logo: {
    width: width * 0.9,
    height: 220,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    color: '#002B5B', // Deep navy matching the text
    lineHeight: 30,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#002B5B',
    opacity: 0.7,
    marginBottom: 10,
  },
  loadingContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  loadingBarBg: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(0, 43, 91, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: '#007BFF',
    borderRadius: 2,
  }
});
