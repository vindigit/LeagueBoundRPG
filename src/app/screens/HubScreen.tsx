/**
 * @file app/screens/HubScreen.tsx
 * @description Hub/Menu screen
 */

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAppStore } from '../../state/store';

const HubScreen: React.FC = () => {
  const startNarrative = useAppStore((state) => state.startNarrative);
  const error = useAppStore((state) => state.error);

  const handleStartNarrative = () => {
    // For now, use a placeholder narrative
    startNarrative('tutorial', 'narratives/tutorial.ink.json');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LeagueBoundRPG</Text>
      <Text style={styles.subtitle}>Road to the League</Text>
      <Text style={styles.description}>
        A single-player, text-based RPG simulation that simulates the career of a basketball
        player from Middle School prospect to NBA legend.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Start New Career" onPress={handleStartNarrative} />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
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
    color: '#1f2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 24,
  },
  buttonContainer: {
    marginTop: 32,
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});

export default HubScreen;
