import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

/**
 * Main application component for LeagueBoundRPG
 * This is a placeholder that will be expanded as the game develops
 */
const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.section}>
            <Text style={styles.title}>LeagueBoundRPG</Text>
            <Text style={styles.subtitle}>Road to the League</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.description}>
              A single-player, text-based RPG simulation that simulates the career of a basketball
              player from Middle School prospect to NBA legend.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    backgroundColor: '#f3f4f6',
  },
  body: {
    backgroundColor: '#ffffff',
    padding: 20,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 8,
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
  },
});

export default App;
