/**
 * @file tests/player.test.ts
 * @description Unit tests for Player model and related functions
 */

import {
  createPlayer,
  calculateOverallRating,
  type Player,
  type PlayerAttributes,
} from '../src/models/Player';

describe('Player Model', () => {
  describe('createPlayer', () => {
    it('creates a player with correct default values', () => {
      const player = createPlayer('John Doe', 'PG', 14);

      expect(player.name).toBe('John Doe');
      expect(player.position).toBe('PG');
      expect(player.age).toBe(14);
      expect(player.energy).toBe(100);
    });

    it('creates a player with default age if not specified', () => {
      const player = createPlayer('Jane Smith', 'SG');

      expect(player.age).toBe(14);
    });

    it('generates unique player IDs', () => {
      const player1 = createPlayer('Player 1', 'PG');
      const player2 = createPlayer('Player 2', 'SG');

      expect(player1.id).toBeDefined();
      expect(player2.id).toBeDefined();
      expect(player1.id).not.toBe(player2.id);
    });

    it('initializes all attributes to 50', () => {
      const player = createPlayer('Test Player', 'SF');

      expect(player.attributes.speed).toBe(50);
      expect(player.attributes.finishing).toBe(50);
      expect(player.attributes.threePoint).toBe(50);
      expect(player.attributes.vision).toBe(50);
      expect(player.attributes.handle).toBe(50);
      expect(player.attributes.defense).toBe(50);
    });

    it('accepts all valid positions', () => {
      const positions: Array<Player['position']> = ['PG', 'SG', 'SF', 'PF', 'C'];

      positions.forEach((position) => {
        const player = createPlayer('Test', position);
        expect(player.position).toBe(position);
      });
    });
  });

  describe('calculateOverallRating', () => {
    it('calculates correct average for equal attributes', () => {
      const attributes: PlayerAttributes = {
        speed: 60,
        finishing: 60,
        threePoint: 60,
        vision: 60,
        handle: 60,
        defense: 60,
      };

      const overall = calculateOverallRating(attributes);
      expect(overall).toBe(60);
    });

    it('calculates correct average for mixed attributes', () => {
      const attributes: PlayerAttributes = {
        speed: 70,
        finishing: 80,
        threePoint: 50,
        vision: 60,
        handle: 90,
        defense: 40,
      };

      const overall = calculateOverallRating(attributes);
      // (70+80+50+60+90+40)/6 = 390/6 = 65
      expect(overall).toBe(65);
    });

    it('rounds to nearest integer', () => {
      const attributes: PlayerAttributes = {
        speed: 71,
        finishing: 72,
        threePoint: 73,
        vision: 74,
        handle: 75,
        defense: 76,
      };

      const overall = calculateOverallRating(attributes);
      // (71+72+73+74+75+76)/6 = 441/6 = 73.5 -> rounds to 74
      expect(overall).toBe(74);
    });
  });
});
