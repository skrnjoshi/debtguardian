import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const ErrorScreen = ({onRetry}) => {
  return (
    <View style={styles.container}>
      {/* Error Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
      </View>

      {/* Error Message */}
      <Text style={styles.title}>Connection Error</Text>
      <Text style={styles.message}>
        Unable to load DebtGuardian.{'\n'}
        Please check your internet connection and try again.
      </Text>

      {/* Retry Button */}
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>

      {/* Help Text */}
      <Text style={styles.helpText}>
        If the problem persists, please contact support.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 30,
  },
  errorIcon: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 30,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
});

export default ErrorScreen;
