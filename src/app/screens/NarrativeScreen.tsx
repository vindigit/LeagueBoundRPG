/**
 * @file app/screens/NarrativeScreen.tsx
 * @description Narrative gameplay screen
 */

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAppStore } from '../../state/store';

const NarrativeScreen: React.FC = () => {
  const returnToHub = useAppStore((state) => state.returnToHub);
  const narrativeId = useAppStore((state) => state.narrativeId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Narrative Mode</Text>
      <Text style={styles.subtitle}>Playing: {narrativeId}</Text>
      <Text style={styles.description}>
        This is where the narrative gameplay would be displayed using the inkjs engine.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Return to Hub" onPress={returnToHub} />
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
});

export default NarrativeScreen;
