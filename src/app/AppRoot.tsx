/**
 * @file app/AppRoot.tsx
 * @description Root composition layer with providers and gates
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './AppNavigator';

/**
 * AppRoot - Provides all global providers and context
 * This is where SafeAreaProvider, theme providers, etc. would go
 */
const AppRoot: React.FC = () => {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default AppRoot;
