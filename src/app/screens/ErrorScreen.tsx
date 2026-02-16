/**
 * @file app/screens/ErrorScreen.tsx
 * @description Error state screen
 */

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAppStore } from '../../state/store';

const ErrorScreen: React.FC = () => {
  const clearError = useAppStore((state) => state.clearError);
  const error = useAppStore((state) => state.error);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error</Text>
      <Text style={styles.errorMessage}>{error || 'An unknown error occurred'}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Return to Hub" onPress={clearError} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ef4444',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 24,
  },
  buttonContainer: {
    marginTop: 32,
  },
});

export default ErrorScreen;
