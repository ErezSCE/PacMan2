// src/game/ghosts/blinky.ts
/**
 * Blinky (the red ghost) targeting logic.
 *
 * In classic Pac‑Man, Blinky directly targets Pac‑Man's current tile.
 * This module provides a lightweight class that extends the core Ghost
 * implementation and adds a `getTargetTile` method used by the engine's
 * path‑finding routine.
 */

import { Ghost, Point } from "../ghost";
import { Direction as PacManDirection } from "../pacman";

/**
 * Minimal Pac‑Man information required for targeting calculations.
 */
export interface PacManInfo {
  /** Pac‑Man's x position in tile coordinates (may be fractional). */
  x: number;
  /** Pac‑Man's y position in tile coordinates (may be fractional). */
  y: number;
  /** Current movement direction. */
  direction: PacManDirection;
}

/**
 * Blinky ghost – simply chases Pac‑Man's current tile.
 */
export class Blinky extends Ghost {
  /**
   * Returns the tile that Blinky is currently targeting.
   * The target is Pac‑Man's tile rounded to the nearest integer coordinates.
   */
  public getTargetTile(pacman: PacManInfo): Point {
    return {
      x: Math.round(pacman.x),
      y: Math.round(pacman.y),
    };
  }
}
