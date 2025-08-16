import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* App Logo/Icon */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>DG</Text>
        </View>
      </View>

      {/* App Name */}
      <Text style={styles.appName}>DebtGuardian</Text>
      <Text style={styles.tagline}>Your Financial Freedom Companion</Text>

      {/* Loading Indicator */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>

      {/* Version */}
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 50,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 15,
    opacity: 0.8,
  },
  version: {
    position: 'absolute',
    bottom: 50,
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.7,
  },
});

export default SplashScreen;
