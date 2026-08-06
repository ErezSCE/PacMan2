// src/game/ghosts/inky.ts
/**
 * Inky (the cyan ghost) targeting logic.
 *
 * Inky uses a vector calculation based on Pac‑Man's position and direction
 * together with Blinky's current position. The classic algorithm is:
 *   1. Find the tile two tiles ahead of Pac‑Man in his current direction.
 *   2. Compute the vector from Blinky to that tile.
 *   3. Double that vector and add it to Blinky's position – the result is the
 *      target tile.
 *
 * This implementation provides a `getTargetTile` method that receives the
 * Pac‑Man info and Blinky's position and returns the calculated target.
 */

import { Ghost, Point } from "../ghost";
import { Direction as PacManDirection } from "../pacman";

export interface PacManInfo {
  x: number;
  y: number;
  direction: PacManDirection;
}

/** Convert Pac‑Man direction to a unit vector (dx, dy). */
function directionToVector(dir: PacManDirection): [number, number] {
  switch (dir) {
    case PacManDirection.Up:
      return [0, -1];
    case PacManDirection.Down:
      return [0, 1];
    case PacManDirection.Left:
      return [-1, 0];
    case PacManDirection.Right:
      return [1, 0];
    default:
      return [0, 0];
  }
}

/** Inky ghost – vector‑based targeting using Blinky's position. */
export class Inky extends Ghost {
  /**
   * Calculate Inky's target tile.
   * @param pacman Pac‑Man's current info.
   * @param blinkyPos Current position of Blinky.
   * @returns Target tile as integer coordinates.
   */
  public getTargetTile(pacman: PacManInfo, blinkyPos: Point): Point {
    const [dx, dy] = directionToVector(pacman.direction);
    // Tile two steps ahead of Pac‑Man.
    const aheadX = pacman.x + dx * 2;
    const aheadY = pacman.y + dy * 2;
    // Vector from Blinky to the ahead point.
    const vectorX = aheadX - blinkyPos.x;
    const vectorY = aheadY - blinkyPos.y;
    // Double the vector.
    const targetX = blinkyPos.x + vectorX * 2;
    const targetY = blinkyPos.y + vectorY * 2;
    return {
      x: Math.round(targetX),
      y: Math.round(targetY),
    };
  }
}
