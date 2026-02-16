/**
 * @file models/Player.ts
 * @description Player model for basketball player attributes and progression
 */

export interface PlayerAttributes {
  speed: number;
  finishing: number;
  threePoint: number;
  vision: number;
  handle: number;
  defense: number;
}

export interface Player {
  id: string;
  name: string;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  attributes: PlayerAttributes;
  age: number;
  energy: number;
}

/**
 * Creates a new player with default attributes
 */
export function createPlayer(
  name: string,
  position: Player['position'],
  age: number = 14,
): Player {
  return {
    id: generatePlayerId(),
    name,
    position,
    age,
    energy: 100,
    attributes: {
      speed: 50,
      finishing: 50,
      threePoint: 50,
      vision: 50,
      handle: 50,
      defense: 50,
    },
  };
}

/**
 * Calculates overall rating from player attributes
 */
export function calculateOverallRating(attributes: PlayerAttributes): number {
  const values = Object.values(attributes);
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / values.length);
}

/**
 * Generates a unique player ID
 */
function generatePlayerId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
