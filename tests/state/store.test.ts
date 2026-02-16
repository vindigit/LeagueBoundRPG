/**
 * @file tests/state/store.test.ts
 * @description Integration tests for the Zustand store with narrative lifecycle
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Story } from 'inkjs/engine/Story';
import { useAppStore } from '../../src/state/store';
import { AppState } from '../../src/state/types';
import {
  setNarrativeService,
  resetNarrativeService,
  NarrativeService,
  FileLoader,
  StoryFactory,
} from '../../src/narrative/narrativeService';

describe('App Store - State Transitions', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useAppStore.getState());
    act(() => {
      result.current.returnToHub();
    });
    resetNarrativeService();
  });

  afterEach(() => {
    resetNarrativeService();
  });

  describe('HUB → NARRATIVE transition (happy path)', () => {
    it('successfully transitions from HUB to NARRATIVE when story loads', async () => {
      // Setup mock narrative service
      const mockStory = { test: 'story' } as unknown as Story;
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue('{"valid": "content"}'),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn().mockReturnValue(mockStory),
      };
      const mockService = new NarrativeService(mockFileLoader, mockStoryFactory);
      setNarrativeService(mockService);

      const { result } = renderHook(() => useAppStore());

      // Initial state should be HUB
      expect(result.current.currentState).toBe(AppState.HUB);
      expect(result.current.narrativeId).toBeNull();
      expect(result.current.error).toBeNull();

      // Trigger transition
      await act(async () => {
        await result.current.startNarrative('tutorial', 'test.ink.json');
      });

      // Should be in NARRATIVE state
      await waitFor(() => {
        expect(result.current.currentState).toBe(AppState.NARRATIVE);
      });
      expect(result.current.narrativeId).toBe('tutorial');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Narrative file missing/empty error handling', () => {
    it('transitions to ERROR when file is empty', async () => {
      // Setup mock narrative service with empty file
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue(''),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn(),
      };
      const mockService = new NarrativeService(mockFileLoader, mockStoryFactory);
      setNarrativeService(mockService);

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.startNarrative('tutorial', 'test.ink.json');
      });

      await waitFor(() => {
        expect(result.current.currentState).toBe(AppState.ERROR);
      });
      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toContain('empty');
    });

    it('stays in HUB with error when narrative ID is empty', async () => {
      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.startNarrative('', 'test.ink.json');
      });

      // Should stay in HUB but have an error
      expect(result.current.currentState).toBe(AppState.HUB);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('Story load success/failure paths', () => {
    it('handles story creation failure (INVALID_FORMAT)', async () => {
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue('{"content": "data"}'),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn().mockImplementation(() => {
          throw new Error('Invalid format');
        }),
      };
      const mockService = new NarrativeService(mockFileLoader, mockStoryFactory);
      setNarrativeService(mockService);

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.startNarrative('tutorial', 'test.ink.json');
      });

      await waitFor(() => {
        expect(result.current.currentState).toBe(AppState.ERROR);
      });
      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toContain('format');
    });

    it('handles file loader failure (LOAD_FAILED)', async () => {
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockRejectedValue(new Error('Network error')),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn(),
      };
      const mockService = new NarrativeService(mockFileLoader, mockStoryFactory);
      setNarrativeService(mockService);

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.startNarrative('tutorial', 'test.ink.json');
      });

      await waitFor(() => {
        expect(result.current.currentState).toBe(AppState.ERROR);
      });
      expect(result.current.error).toBeTruthy();
    });

    it('successfully loads story and transitions to NARRATIVE', async () => {
      const mockStory = { test: 'story' } as unknown as Story;
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue('{"content": "data"}'),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn().mockReturnValue(mockStory),
      };
      const mockService = new NarrativeService(mockFileLoader, mockStoryFactory);
      setNarrativeService(mockService);

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.startNarrative('tutorial', 'test.ink.json');
      });

      await waitFor(() => {
        expect(result.current.currentState).toBe(AppState.NARRATIVE);
      });
      expect(mockService.getCurrentStory()).toBe(mockStory);
    });
  });

  describe('NARRATIVE → HUB transition', () => {
    it('returns to HUB and tears down narrative', async () => {
      // First, set up in NARRATIVE state
      const mockStory = { test: 'story' } as unknown as Story;
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue('{"content": "data"}'),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn().mockReturnValue(mockStory),
      };
      const mockService = new NarrativeService(mockFileLoader, mockStoryFactory);
      setNarrativeService(mockService);

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.startNarrative('tutorial', 'test.ink.json');
      });

      await waitFor(() => {
        expect(result.current.currentState).toBe(AppState.NARRATIVE);
      });
      expect(mockService.hasStory()).toBe(true);

      // Now return to hub
      act(() => {
        result.current.returnToHub();
      });

      expect(result.current.currentState).toBe(AppState.HUB);
      expect(result.current.narrativeId).toBeNull();
      expect(mockService.hasStory()).toBe(false);
    });
  });

  describe('ERROR → HUB transition', () => {
    it('clears error and returns to HUB', async () => {
      // Setup to cause an error
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue(''),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn(),
      };
      const mockService = new NarrativeService(mockFileLoader, mockStoryFactory);
      setNarrativeService(mockService);

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.startNarrative('tutorial', 'test.ink.json');
      });

      await waitFor(() => {
        expect(result.current.currentState).toBe(AppState.ERROR);
      });
      expect(result.current.error).toBeTruthy();

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.currentState).toBe(AppState.HUB);
      expect(result.current.error).toBeNull();
    });
  });
});
