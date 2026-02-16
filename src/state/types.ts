/**
 * @file state/types.ts
 * @description Core app state types and constants
 */

/**
 * Enumeration of all possible app states
 */
export enum AppState {
  /** Hub/menu screen - the main menu/home screen */
  HUB = 'HUB',
  /** Narrative mode - actively playing through a narrative/story */
  NARRATIVE = 'NARRATIVE',
  /** Error state - something went wrong */
  ERROR = 'ERROR',
}

/**
 * Result type for operations that can succeed or fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Error types for narrative loading
 */
export enum NarrativeError {
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_EMPTY = 'FILE_EMPTY',
  LOAD_FAILED = 'LOAD_FAILED',
  INVALID_FORMAT = 'INVALID_FORMAT',
}

/**
 * Narrative metadata
 */
export interface NarrativeMetadata {
  id: string;
  title: string;
  filePath: string;
}

/**
 * Complete app state shape
 */
export interface AppStateModel {
  currentState: AppState;
  error: string | null;
  narrativeId: string | null;
}

/**
 * State transition request
 */
export interface TransitionRequest {
  from: AppState;
  to: AppState;
  payload?: unknown;
}
