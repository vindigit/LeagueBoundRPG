/**
 * @file tests/state/transitions.test.ts
 * @description Tests for pure state transition functions
 */

import {
  createInitialState,
  isTransitionAllowed,
  transitionToNarrative,
  transitionToHub,
  transitionToError,
} from '../../src/state/transitions';
import { AppState } from '../../src/state/types';

describe('State Transitions', () => {
  describe('isTransitionAllowed', () => {
    it('allows HUB → NARRATIVE transition', () => {
      expect(isTransitionAllowed(AppState.HUB, AppState.NARRATIVE)).toBe(true);
    });

    it('allows HUB → ERROR transition', () => {
      expect(isTransitionAllowed(AppState.HUB, AppState.ERROR)).toBe(true);
    });

    it('allows NARRATIVE → HUB transition', () => {
      expect(isTransitionAllowed(AppState.NARRATIVE, AppState.HUB)).toBe(true);
    });

    it('allows NARRATIVE → ERROR transition', () => {
      expect(isTransitionAllowed(AppState.NARRATIVE, AppState.ERROR)).toBe(true);
    });

    it('allows ERROR → HUB transition', () => {
      expect(isTransitionAllowed(AppState.ERROR, AppState.HUB)).toBe(true);
    });

    it('disallows ERROR → NARRATIVE transition', () => {
      expect(isTransitionAllowed(AppState.ERROR, AppState.NARRATIVE)).toBe(false);
    });

    it('disallows HUB → HUB transition', () => {
      expect(isTransitionAllowed(AppState.HUB, AppState.HUB)).toBe(false);
    });
  });

  describe('transitionToNarrative', () => {
    it('successfully transitions from HUB to NARRATIVE with valid ID', () => {
      const currentState = createInitialState();
      const result = transitionToNarrative(currentState, 'tutorial');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currentState).toBe(AppState.NARRATIVE);
        expect(result.data.narrativeId).toBe('tutorial');
        expect(result.data.error).toBeNull();
      }
    });

    it('fails when narrativeId is empty', () => {
      const currentState = createInitialState();
      const result = transitionToNarrative(currentState, '');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Narrative ID is required');
      }
    });

    it('fails when transitioning from ERROR state', () => {
      const currentState = {
        currentState: AppState.ERROR,
        error: 'Test error',
        narrativeId: null,
      };
      const result = transitionToNarrative(currentState, 'tutorial');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Invalid transition');
      }
    });
  });

  describe('transitionToHub', () => {
    it('successfully transitions from NARRATIVE to HUB', () => {
      const currentState = {
        currentState: AppState.NARRATIVE,
        error: null,
        narrativeId: 'tutorial',
      };
      const result = transitionToHub(currentState);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currentState).toBe(AppState.HUB);
        expect(result.data.narrativeId).toBeNull();
        expect(result.data.error).toBeNull();
      }
    });

    it('successfully transitions from ERROR to HUB', () => {
      const currentState = {
        currentState: AppState.ERROR,
        error: 'Test error',
        narrativeId: null,
      };
      const result = transitionToHub(currentState);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currentState).toBe(AppState.HUB);
        expect(result.data.error).toBeNull();
      }
    });
  });

  describe('transitionToError', () => {
    it('successfully transitions from HUB to ERROR', () => {
      const currentState = createInitialState();
      const errorMessage = 'Test error message';
      const result = transitionToError(currentState, errorMessage);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currentState).toBe(AppState.ERROR);
        expect(result.data.error).toBe(errorMessage);
      }
    });

    it('successfully transitions from NARRATIVE to ERROR', () => {
      const currentState = {
        currentState: AppState.NARRATIVE,
        error: null,
        narrativeId: 'tutorial',
      };
      const errorMessage = 'Loading failed';
      const result = transitionToError(currentState, errorMessage);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currentState).toBe(AppState.ERROR);
        expect(result.data.error).toBe(errorMessage);
        expect(result.data.narrativeId).toBe('tutorial'); // preserves narrative ID
      }
    });
  });

  describe('createInitialState', () => {
    it('creates initial state in HUB', () => {
      const state = createInitialState();

      expect(state.currentState).toBe(AppState.HUB);
      expect(state.error).toBeNull();
      expect(state.narrativeId).toBeNull();
    });
  });
});
