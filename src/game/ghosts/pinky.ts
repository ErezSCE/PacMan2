// src/game/ghosts/pinky.ts
/**
 * Pinky (the pink ghost) targeting logic.
 *
 * Pinky targets four tiles ahead of Pac‑Man's current direction.
 * This implementation provides a `getTargetTile` method used by the engine's
 * path‑finding routine.
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

/** Pinky ghost – targets four tiles ahead of Pac‑Man. */
export class Pinky extends Ghost {
  public getTargetTile(pacman: PacManInfo): Point {
    const [dx, dy] = directionToVector(pacman.direction);
    const targetX = Math.round(pacman.x + dx * 4);
    const targetY = Math.round(pacman.y + dy * 4);
    return { x: targetX, y: targetY };
  }
}
