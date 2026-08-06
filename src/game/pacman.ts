// src/game/pacman.ts
/**
 * PacMan movement and interaction logic.
 *
 * The PacMan class tracks the character's position, direction, speed and
 * provides an `update` method that advances the character based on the elapsed
 * time and the current maze layout.
 *
 * The maze grid uses the following cell values:
 *   0 – empty (walkable)
 *   1 – wall (solid)
 *   2 – dot (collectible)
 *   3 – power‑pellet (collectible, triggers scared mode)
 */

import type { Maze } from '../maze';
import { Score } from './score';
import { Lives } from './lives';

export enum Direction {
  None = 0,
  Up = 1,
  Down = 2,
  Left = 3,
  Right = 4,
}

/**
 * Helper to convert a direction into a delta vector (dx, dy) where each unit
 * corresponds to one tile.
 */
function directionToVector(dir: Direction): [number, number] {
  switch (dir) {
    case Direction.Up:
      return [0, -1];
    case Direction.Down:
      return [0, 1];
    case Direction.Left:
      return [-1, 0];
    case Direction.Right:
      return [1, 0];
    default:
      return [0, 0];
  }
}

/**
 * PacMan entity.
 */
export class PacMan {
  // Position in tile coordinates (can be fractional for smooth movement)
  public x: number;
  public y: number;

  // Current movement direction
  private direction: Direction = Direction.None;
  // Desired direction set by the player – will be applied when possible
  private pendingDirection: Direction = Direction.None;

  // Speed in tiles per second (default classic speed)
  public speed: number = 5; // tiles per second

  // References to shared services
  private score: Score;
  private lives: Lives;

  constructor(
    startX: number,
    startY: number,
    score: Score,
    lives: Lives,
    speed?: number,
  ) {
    this.x = startX;
    this.y = startY;
    this.score = score;
    this.lives = lives;
    if (speed !== undefined) this.speed = speed;
  }

  /** Set the direction requested by the player. */
  public setDirection(dir: Direction): void {
    this.pendingDirection = dir;
  }

  /** Get the current direction (useful for rendering). */
  public getDirection(): Direction {
    return this.direction;
  }

  /** Core update loop – called each frame with the elapsed time in seconds. */
  public update(deltaTime: number, maze: Maze): void {
    // Try to apply pending direction if possible (i.e., the tile in that
    // direction is not a wall). This mimics classic Pac‑Man turning at
    // intersections.
    if (this.pendingDirection !== Direction.None) {
      const [dx, dy] = directionToVector(this.pendingDirection);
      const targetX = Math.round(this.x + dx);
      const targetY = Math.round(this.y + dy);
      if (maze[targetY]?.[targetX] !== 1) {
        this.direction = this.pendingDirection;
        this.pendingDirection = Direction.None;
      }
    }

    if (this.direction === Direction.None) {
      return; // No movement requested.
    }

    const [dx, dy] = directionToVector(this.direction);
    const distance = this.speed * deltaTime; // tiles to move this frame
    const newX = this.x + dx * distance;
    const newY = this.y + dy * distance;

    // Determine the tile we would occupy after moving. We only allow movement
    // if the destination tile is not a wall. For simplicity we check the tile
    // at the *rounded* coordinates.
    const targetTileX = Math.round(newX);
    const targetTileY = Math.round(newY);
    const tileValue = maze[targetTileY]?.[targetTileX];

    if (tileValue === 1) {
      // Collision with a wall – stop at the current tile boundary.
      // We snap the position to the centre of the current tile to avoid
      // drifting into the wall over time.
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      this.direction = Direction.None;
      return;
    }

    // No collision – apply movement.
    this.x = newX;
    this.y = newY;

    // Handle consumables (dot or power‑pellet) if we are roughly centred on a
    // tile.
    if (Math.abs(this.x - Math.round(this.x)) < 0.01 && Math.abs(this.y - Math.round(this.y)) < 0.01) {
      const tileX = Math.round(this.x);
      const tileY = Math.round(this.y);
      const cell = maze[tileY]?.[tileX];
      if (cell === 2) {
        // Dot
        this.score.addPoints(10);
        // Remove the dot from the maze – caller may handle persistence.
        (maze as number[][])[tileY][tileX] = 0;
      } else if (cell === 3) {
        // Power pellet
        this.score.addPoints(50);
        // Trigger scared mode – for now we just set a flag on the score.
        this.score.enterScaredMode();
        (maze as number[][])[tileY][tileX] = 0;
      }
    }
  }

  /**
   * Called by the engine when Pac‑Man collides with a ghost.
   * If Pac‑Man is not in scared mode, a life is lost.
   * If Pac‑Man is scared, Pac‑Man eats the ghost and gains points.
   */
  public handleGhostCollision(): void {
    if (!this.score.isScared()) {
      this.lives.loseLife();
    } else {
      // Award points based on current ghost multiplier and then increase it.
      this.score.addPoints(this.score.getGhostMultiplier());
      this.score.increaseGhostMultiplier();
    }
  }
}
