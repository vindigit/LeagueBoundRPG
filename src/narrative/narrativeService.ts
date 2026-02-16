/**
 * @file narrative/narrativeService.ts
 * @description Narrative engine lifecycle owner - handles loading, creation, and teardown
 */

import { Story } from 'inkjs/engine/Story';
import { NarrativeError, Result } from '../state/types';

/**
 * Interface for file loading (allows dependency injection for testing)
 */
export interface FileLoader {
  loadFile(path: string): Promise<string>;
}

/**
 * Interface for story creation (allows dependency injection for testing)
 */
export interface StoryFactory {
  createStory(content: string): Story;
}

/**
 * Default file loader implementation
 */
export const defaultFileLoader: FileLoader = {
  async loadFile(path: string): Promise<string> {
    // In a real React Native app, this would use RNFS or similar
    // For now, throw an error to show the pattern
    throw new Error(`File loading not implemented: ${path}`);
  },
};

/**
 * Default story factory implementation
 */
export const defaultStoryFactory: StoryFactory = {
  createStory(content: string): Story {
    return new Story(content);
  },
};

/**
 * Narrative service - single owner of narrative engine lifecycle
 */
export class NarrativeService {
  private currentStory: Story | null = null;
  private fileLoader: FileLoader;
  private storyFactory: StoryFactory;

  constructor(
    fileLoader: FileLoader = defaultFileLoader,
    storyFactory: StoryFactory = defaultStoryFactory,
  ) {
    this.fileLoader = fileLoader;
    this.storyFactory = storyFactory;
  }

  /**
   * Load a narrative story from a file path
   */
  async loadStory(filePath: string): Promise<Result<Story, NarrativeError>> {
    try {
      // Validate file path
      if (!filePath || filePath.trim() === '') {
        return {
          success: false,
          error: NarrativeError.FILE_NOT_FOUND,
        };
      }

      // Load file content
      const content = await this.fileLoader.loadFile(filePath);

      // Validate content
      if (!content || content.trim() === '') {
        return {
          success: false,
          error: NarrativeError.FILE_EMPTY,
        };
      }

      // Create story
      try {
        const story = this.storyFactory.createStory(content);

        // Teardown old story if exists
        if (this.currentStory) {
          this.teardown();
        }

        this.currentStory = story;

        return {
          success: true,
          data: story,
        };
      } catch (error) {
        return {
          success: false,
          error: NarrativeError.INVALID_FORMAT,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: NarrativeError.LOAD_FAILED,
      };
    }
  }

  /**
   * Get the current story (if any)
   */
  getCurrentStory(): Story | null {
    return this.currentStory;
  }

  /**
   * Teardown the current story and clean up resources
   */
  teardown(): void {
    if (this.currentStory) {
      // Clean up story resources
      this.currentStory = null;
    }
  }

  /**
   * Check if a story is currently loaded
   */
  hasStory(): boolean {
    return this.currentStory !== null;
  }
}

/**
 * Singleton instance (can be overridden for testing)
 */
let narrativeServiceInstance: NarrativeService | null = null;

/**
 * Get the global narrative service instance
 */
export function getNarrativeService(): NarrativeService {
  if (!narrativeServiceInstance) {
    narrativeServiceInstance = new NarrativeService();
  }
  return narrativeServiceInstance;
}

/**
 * Set the global narrative service instance (for testing)
 */
export function setNarrativeService(service: NarrativeService): void {
  narrativeServiceInstance = service;
}

/**
 * Reset the global narrative service instance (for testing)
 */
export function resetNarrativeService(): void {
  if (narrativeServiceInstance) {
    narrativeServiceInstance.teardown();
  }
  narrativeServiceInstance = null;
}
