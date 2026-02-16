/**
 * @file state/store.ts
 * @description Zustand store with validated state transitions
 */

import { create } from 'zustand';
import { AppState, AppStateModel, NarrativeError } from './types';
import {
  createInitialState,
  transitionToNarrative,
  transitionToHub,
  transitionToError,
} from './transitions';
import { getNarrativeService } from '../narrative/narrativeService';

/**
 * Store actions
 */
interface AppStoreActions {
  /**
   * Start a narrative by ID
   */
  startNarrative: (narrativeId: string, filePath: string) => Promise<void>;

  /**
   * Return to hub
   */
  returnToHub: () => void;

  /**
   * Set error state
   */
  setError: (error: string) => void;

  /**
   * Clear error and return to hub
   */
  clearError: () => void;
}

/**
 * Complete store type
 */
type AppStore = AppStateModel & AppStoreActions;

/**
 * App store using Zustand with validated transitions
 */
export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  ...createInitialState(),

  // Actions
  startNarrative: async (narrativeId: string, filePath: string) => {
    const currentState = get();

    // Attempt transition to NARRATIVE
    const transitionResult = transitionToNarrative(currentState, narrativeId);

    if (!transitionResult.success) {
      console.error('Transition failed:', transitionResult.error.message);
      // Stay in current state, optionally set error
      set({
        error: transitionResult.error.message,
      });
      return;
    }

    // Transition is valid, now load the story
    const narrativeService = getNarrativeService();
    const loadResult = await narrativeService.loadStory(filePath);

    if (!loadResult.success) {
      // Story load failed, transition to error state
      const errorMessage = getNarrativeErrorMessage(loadResult.error);
      const errorTransition = transitionToError(currentState, errorMessage);

      if (errorTransition.success) {
        set(errorTransition.data);
      } else {
        // Fallback: stay in current state with error
        set({ error: errorMessage });
      }
      return;
    }

    // Success: apply the narrative transition
    set(transitionResult.data);
  },

  returnToHub: () => {
    const currentState = get();

    // Teardown narrative if exists
    const narrativeService = getNarrativeService();
    narrativeService.teardown();

    // Attempt transition to HUB
    const transitionResult = transitionToHub(currentState);

    if (transitionResult.success) {
      set(transitionResult.data);
    } else {
      console.error('Transition to hub failed:', transitionResult.error.message);
    }
  },

  setError: (error: string) => {
    const currentState = get();
    const transitionResult = transitionToError(currentState, error);

    if (transitionResult.success) {
      set(transitionResult.data);
    } else {
      // Fallback: just set error without state transition
      set({ error });
    }
  },

  clearError: () => {
    const currentState = get();

    if (currentState.currentState === AppState.ERROR) {
      const transitionResult = transitionToHub(currentState);
      if (transitionResult.success) {
        set(transitionResult.data);
      }
    } else {
      // Just clear error
      set({ error: null });
    }
  },
}));

/**
 * Helper to convert NarrativeError enum to user-friendly message
 */
function getNarrativeErrorMessage(error: NarrativeError): string {
  switch (error) {
    case NarrativeError.FILE_NOT_FOUND:
      return 'Narrative file not found';
    case NarrativeError.FILE_EMPTY:
      return 'Narrative file is empty';
    case NarrativeError.LOAD_FAILED:
      return 'Failed to load narrative';
    case NarrativeError.INVALID_FORMAT:
      return 'Invalid narrative format';
    default:
      return 'Unknown error loading narrative';
  }
}
