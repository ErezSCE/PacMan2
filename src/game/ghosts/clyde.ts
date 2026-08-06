// src/game/ghosts/clyde.ts
/**
 * Clyde (the orange ghost) targeting logic.
 *
 * Clyde behaves differently based on its distance to Pac‑Man:
 *   - If the distance (in tiles) is greater than 8, Clyde targets Pac‑Man's
 *     current tile (chase mode).
 *   - Otherwise, Clyde wanders by targeting its home corner (scatter mode).
 *
 * The classic game uses a slightly different threshold and a random wander
 * target, but for deterministic unit testing we use the home position as the
 * scatter target.
 */

import { Ghost, Point } from "../ghost";
import { Direction as PacManDirection } from "../pacman";

export interface PacManInfo {
  x: number;
  y: number;
  direction: PacManDirection;
}

/** Compute Euclidean distance between two points. */
function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Clyde ghost – distance‑based targeting. */
export class Clyde extends Ghost {
  public getTargetTile(pacman: PacManInfo): Point {
    const ghostPos: Point = { x: this.position.x, y: this.position.y };
    const pacPos: Point = { x: pacman.x, y: pacman.y };
    if (distance(ghostPos, pacPos) > 8) {
      // Chase Pac‑Man
      return { x: Math.round(pacman.x), y: Math.round(pacman.y) };
    }
    // Scatter – target home corner (using protected accessor from base class)
    const home = this.getHomePosition();
    return { x: Math.round(home.x), y: Math.round(home.y) };
  }
}
