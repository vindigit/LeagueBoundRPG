/**
 * @file state/transitions.ts
 * @description Pure state transition functions with validation
 */

import { AppState, AppStateModel, Result } from './types';

/**
 * Allowed state transitions map
 * Defines which states can transition to which other states
 */
const ALLOWED_TRANSITIONS: Record<AppState, AppState[]> = {
  [AppState.HUB]: [AppState.NARRATIVE, AppState.ERROR],
  [AppState.NARRATIVE]: [AppState.HUB, AppState.ERROR],
  [AppState.ERROR]: [AppState.HUB],
};

/**
 * Validates whether a transition from one state to another is allowed
 */
export function isTransitionAllowed(from: AppState, to: AppState): boolean {
  const allowedTargets = ALLOWED_TRANSITIONS[from];
  return allowedTargets.includes(to);
}

/**
 * Pure transition function: HUB → NARRATIVE
 * Validates the transition and returns new state or error
 */
export function transitionToNarrative(
  currentState: AppStateModel,
  narrativeId: string,
): Result<AppStateModel> {
  if (!narrativeId || narrativeId.trim() === '') {
    return {
      success: false,
      error: new Error('Narrative ID is required'),
    };
  }

  if (!isTransitionAllowed(currentState.currentState, AppState.NARRATIVE)) {
    return {
      success: false,
      error: new Error(
        `Invalid transition from ${currentState.currentState} to ${AppState.NARRATIVE}`,
      ),
    };
  }

  return {
    success: true,
    data: {
      currentState: AppState.NARRATIVE,
      error: null,
      narrativeId,
    },
  };
}

/**
 * Pure transition function: NARRATIVE → HUB (or any state → HUB)
 */
export function transitionToHub(
  currentState: AppStateModel,
): Result<AppStateModel> {
  if (!isTransitionAllowed(currentState.currentState, AppState.HUB)) {
    return {
      success: false,
      error: new Error(
        `Invalid transition from ${currentState.currentState} to ${AppState.HUB}`,
      ),
    };
  }

  return {
    success: true,
    data: {
      currentState: AppState.HUB,
      error: null,
      narrativeId: null,
    },
  };
}

/**
 * Pure transition function: Any state → ERROR
 */
export function transitionToError(
  currentState: AppStateModel,
  errorMessage: string,
): Result<AppStateModel> {
  if (!isTransitionAllowed(currentState.currentState, AppState.ERROR)) {
    return {
      success: false,
      error: new Error(
        `Invalid transition from ${currentState.currentState} to ${AppState.ERROR}`,
      ),
    };
  }

  return {
    success: true,
    data: {
      currentState: AppState.ERROR,
      error: errorMessage,
      narrativeId: currentState.narrativeId,
    },
  };
}

/**
 * Creates initial app state
 */
export function createInitialState(): AppStateModel {
  return {
    currentState: AppState.HUB,
    error: null,
    narrativeId: null,
  };
}
