/**
 * Level manager for handling level progression and providing level‑specific configuration.
 *
 * The level data is stored in a JSON file (src/levels/levels.json) which contains an
 * array of level configurations. Each configuration includes the maze layout, ghost
 * house position, ghost speed and frightened duration.
 *
 * This manager tracks the *display* level number (1‑20) and supplies the appropriate
 * configuration for the engine. After completing level 20 the display level cycles
 * back to 1, but the difficulty (speed, timers) stays at the maximum (level 20) as
 * required by the user story.
 */
import levelData from "../levels/levels.json";

export interface Point {
  x: number;
  y: number;
}

export interface LevelConfig {
  level: number;
  maze: number[][];
  ghostHouse: Point;
  ghostSpeed: number; // pixels per second
  frightenedDuration: number; // ms
}

/**
 * Simple wrapper around the static JSON data. Provides helpers to retrieve the
 * configuration for the current level and to advance to the next level.
 */
export class LevelManager {
  private currentDisplayLevel: number = 1; // what the player sees (1‑20 loop)

  constructor(initialLevel?: number) {
    if (initialLevel !== undefined) {
      this.currentDisplayLevel = ((initialLevel - 1) % 20) + 1;
    }
  }

  /** Return the level number shown to the player (1‑20). */
  public getLevel(): number {
    return this.currentDisplayLevel;
  }

  /** Advance to the next level. Loops after 20 back to 1 but retains max difficulty. */
  public nextLevel(): void {
    this.currentDisplayLevel = this.currentDisplayLevel % 20 + 1;
  }

  /** Get the configuration for the *effective* difficulty level.
   *  For levels 1‑20 the config matches the level number. For any level beyond 20
   *  (which only occurs after looping) we keep using the config of level 20.
   */
  public getConfig(): LevelConfig {
    const effectiveLevel = Math.min(this.currentDisplayLevel, 20);
    const cfg = (levelData as any).levels.find((l: LevelConfig) => l.level === effectiveLevel);
    if (!cfg) {
      throw new Error(`Level configuration for level ${effectiveLevel} not found`);
    }
    return cfg as LevelConfig;
  }
}
