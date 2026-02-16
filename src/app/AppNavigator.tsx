/**
 * @file app/AppNavigator.tsx
 * @description State-based router - chooses which screen to render based on app state
 */

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../state/store';
import { AppState } from '../state/types';
import HubScreen from './screens/HubScreen';
import NarrativeScreen from './screens/NarrativeScreen';
import ErrorScreen from './screens/ErrorScreen';

/**
 * AppNavigator - State-based routing
 * Renders the appropriate screen based on the current app state
 */
const AppNavigator: React.FC = () => {
  const currentState = useAppStore((state) => state.currentState);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {currentState === AppState.HUB && <HubScreen />}
      {currentState === AppState.NARRATIVE && <NarrativeScreen />}
      {currentState === AppState.ERROR && <ErrorScreen />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppNavigator;
