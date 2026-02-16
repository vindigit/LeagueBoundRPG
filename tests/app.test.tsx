/**
 * @file app.test.tsx
 * @description Basic test for the LeagueBoundRPG application
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../src/app';
import { AppState } from '../src/state/types';
import { useAppStore } from '../src/state/store';

// Mock SafeAreaProvider
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('App', () => {
  it('renders correctly and starts in HUB state', () => {
    const { getByText } = render(<App />);
    expect(getByText('LeagueBoundRPG')).toBeTruthy();
  });

  it('displays the subtitle in HUB state', () => {
    const { getByText } = render(<App />);
    expect(getByText('Road to the League')).toBeTruthy();
  });

  it('displays the description in HUB state', () => {
    const { getByText } = render(<App />);
    const descriptionText = 'A single-player, text-based RPG simulation that simulates the career of a basketball player from Middle School prospect to NBA legend.';
    expect(getByText(descriptionText)).toBeTruthy();
  });

  it('initializes with app state in HUB', () => {
    render(<App />);
    const state = useAppStore.getState();
    expect(state.currentState).toBe(AppState.HUB);
  });
});
