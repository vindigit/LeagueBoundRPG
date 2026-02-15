/**
 * @file app.test.tsx
 * @description Basic placeholder test for the LeagueBoundRPG application
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../src/app';

describe('App', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);
    expect(getByText('LeagueBoundRPG')).toBeTruthy();
  });

  it('displays the subtitle', () => {
    const { getByText } = render(<App />);
    expect(getByText('Road to the League')).toBeTruthy();
  });

  it('displays the description', () => {
    const { getByText } = render(<App />);
    const descriptionText = 'A single-player, text-based RPG simulation that simulates the career of a basketball player from Middle School prospect to NBA legend.';
    expect(getByText(descriptionText)).toBeTruthy();
  });
});
