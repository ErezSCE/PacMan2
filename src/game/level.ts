// src/game/level.ts
/**
 * Level management utilities.
 *
 * For the scope of this PR we only need to detect when a level is complete –
 * i.e., when there are no remaining dots (2) or power‑pellets (3) in the maze.
 * The `isComplete` function scans the maze and returns a boolean.
 *
 * A `LevelManager` class is provided to encapsulate the current level index
 * and to expose a method for advancing to the next level. In a full game this
 * would also handle loading new maze data, resetting Pac‑Man position, etc.
 */

import type { Maze } from '../maze';

export class LevelManager {
  private currentLevel: number = 1;

  constructor(initialLevel?: number) {
    if (initialLevel !== undefined) this.currentLevel = initialLevel;
  }

  /** Return the current level number. */
  public getLevel(): number {
    return this.currentLevel;
  }

  /** Check if the provided maze has any remaining consumables. */
  public isComplete(maze: Maze): boolean {
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const cell = maze[y][x];
        if (cell === 2 || cell === 3) {
          return false; // still have a dot or power‑pellet
        }
      }
    }
    return true;
  }

  /** Advance to the next level. */
  public nextLevel(): void {
    this.currentLevel += 1;
    // In a full implementation we would load the new maze data here.
  }
}
