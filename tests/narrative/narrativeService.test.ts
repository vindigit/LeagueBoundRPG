/**
 * @file tests/narrative/narrativeService.test.ts
 * @description Tests for narrative service - narrative engine lifecycle owner
 */

import { Story } from 'inkjs/engine/Story';
import {
  NarrativeService,
  FileLoader,
  StoryFactory,
} from '../../src/narrative/narrativeService';
import { NarrativeError } from '../../src/state/types';

describe('NarrativeService', () => {
  describe('loadStory - file not found', () => {
    it('returns FILE_NOT_FOUND error when path is empty', async () => {
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue(''),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn(),
      };

      const service = new NarrativeService(mockFileLoader, mockStoryFactory);
      const result = await service.loadStory('');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(NarrativeError.FILE_NOT_FOUND);
      }
    });
  });

  describe('loadStory - file empty', () => {
    it('returns FILE_EMPTY error when file content is empty', async () => {
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue(''),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn(),
      };

      const service = new NarrativeService(mockFileLoader, mockStoryFactory);
      const result = await service.loadStory('test.ink.json');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(NarrativeError.FILE_EMPTY);
      }
    });

    it('returns FILE_EMPTY error when file content is only whitespace', async () => {
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue('   \n  \t  '),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn(),
      };

      const service = new NarrativeService(mockFileLoader, mockStoryFactory);
      const result = await service.loadStory('test.ink.json');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(NarrativeError.FILE_EMPTY);
      }
    });
  });

  describe('loadStory - load failed', () => {
    it('returns LOAD_FAILED error when file loader throws', async () => {
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockRejectedValue(new Error('File system error')),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn(),
      };

      const service = new NarrativeService(mockFileLoader, mockStoryFactory);
      const result = await service.loadStory('test.ink.json');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(NarrativeError.LOAD_FAILED);
      }
    });
  });

  describe('loadStory - invalid format', () => {
    it('returns INVALID_FORMAT error when story factory throws', async () => {
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue('{"invalid": "content"}'),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn().mockImplementation(() => {
          throw new Error('Invalid ink format');
        }),
      };

      const service = new NarrativeService(mockFileLoader, mockStoryFactory);
      const result = await service.loadStory('test.ink.json');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(NarrativeError.INVALID_FORMAT);
      }
    });
  });

  describe('loadStory - success', () => {
    it('successfully loads a story and returns it', async () => {
      const mockStory = { test: 'story' } as unknown as Story;
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue('{"valid": "content"}'),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn().mockReturnValue(mockStory),
      };

      const service = new NarrativeService(mockFileLoader, mockStoryFactory);
      const result = await service.loadStory('test.ink.json');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockStory);
      }
      expect(mockFileLoader.loadFile).toHaveBeenCalledWith('test.ink.json');
      expect(mockStoryFactory.createStory).toHaveBeenCalledWith('{"valid": "content"}');
    });

    it('sets currentStory when load succeeds', async () => {
      const mockStory = { test: 'story' } as unknown as Story;
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue('{"valid": "content"}'),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn().mockReturnValue(mockStory),
      };

      const service = new NarrativeService(mockFileLoader, mockStoryFactory);
      await service.loadStory('test.ink.json');

      expect(service.getCurrentStory()).toBe(mockStory);
      expect(service.hasStory()).toBe(true);
    });

    it('tears down old story when loading new one', async () => {
      const mockStory1 = { test: 'story1' } as unknown as Story;
      const mockStory2 = { test: 'story2' } as unknown as Story;
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue('{"valid": "content"}'),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest
          .fn()
          .mockReturnValueOnce(mockStory1)
          .mockReturnValueOnce(mockStory2),
      };

      const service = new NarrativeService(mockFileLoader, mockStoryFactory);
      await service.loadStory('test1.ink.json');
      expect(service.getCurrentStory()).toBe(mockStory1);

      await service.loadStory('test2.ink.json');
      expect(service.getCurrentStory()).toBe(mockStory2);
    });
  });

  describe('teardown', () => {
    it('clears current story', async () => {
      const mockStory = { test: 'story' } as unknown as Story;
      const mockFileLoader: FileLoader = {
        loadFile: jest.fn().mockResolvedValue('{"valid": "content"}'),
      };
      const mockStoryFactory: StoryFactory = {
        createStory: jest.fn().mockReturnValue(mockStory),
      };

      const service = new NarrativeService(mockFileLoader, mockStoryFactory);
      await service.loadStory('test.ink.json');
      expect(service.hasStory()).toBe(true);

      service.teardown();
      expect(service.getCurrentStory()).toBeNull();
      expect(service.hasStory()).toBe(false);
    });
  });
});
