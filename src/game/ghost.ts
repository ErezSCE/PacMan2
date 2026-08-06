// src/game/ghost.ts
/**
 * Ghost core logic with a simple state machine.
 * Supports the classic Pac‑Man ghost behaviours: chase, scatter, frightened, and eaten.
 * The implementation is deliberately lightweight – it only models state transitions
 * and speed modifiers. Rendering, AI path‑finding and sprite handling are performed
 * elsewhere in the codebase.
 */

export enum GhostState {
  Chase = "CHASE",
  Scatter = "SCATTER",
  Frightened = "FRIGHTENED",
  Eaten = "EATEN",
}

export type Direction = "up" | "down" | "left" | "right";

/**
 * Configuration for the chase / scatter cycle.
 * Each entry defines the state (chase or scatter) and its duration in milliseconds.
 * The classic Pac‑Man timings (in seconds) are approximated here:
 *   - Chase 7s, Scatter 5s, Chase 7s, Scatter 5s, Chase 5s, Scatter 5s, Chase 5s, Scatter ∞
 * For simplicity we treat the final scatter as a very long duration.
 */
const MODE_SEQUENCE: { state: GhostState.Chase | GhostState.Scatter; duration: number }[] = [
  { state: GhostState.Chase, duration: 7_000 },
  { state: GhostState.Scatter, duration: 5_000 },
  { state: GhostState.Chase, duration: 7_000 },
  { state: GhostState.Scatter, duration: 5_000 },
  { state: GhostState.Chase, duration: 5_000 },
  { state: GhostState.Scatter, duration: 5_000 },
  { state: GhostState.Chase, duration: 5_000 },
  // final scatter – effectively infinite (use a large number)
  { state: GhostState.Scatter, duration: 999_999_999 },
];

/**
 * Simple 2‑D point used for position handling.
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Ghost class – encapsulates state, timers and basic behaviour.
 */
export class Ghost {
  // Public read‑only properties for external consumers (UI, engine, tests)
  public state: GhostState = GhostState.Chase;
  public position: Point;
  public direction: Direction = "left";

  // Base speed in pixels per second (arbitrary, can be tuned by the engine)
  private readonly baseSpeed: number = 100;

  // Internal timers (in ms)
  private modeTimer: number; // time left for current chase/scatter mode
  private modeIndex: number = 0; // index into MODE_SEQUENCE

  private frightenedTimer: number = 0; // remaining frightened time
  private returnHomeTimer: number = 0; // timer after being eaten

  // Remember the mode we were in before entering frightened – needed to restore.
  private previousMode: GhostState.Chase | GhostState.Scatter = GhostState.Chase;

  // Home (ghost house) position – used for eye‑return animation.
  private readonly homePosition: Point;

  constructor(startPos: Point, homePos: Point) {
    this.position = { ...startPos };
    this.homePosition = { ...homePos };
    // Initialise the first mode timer.
    this.modeTimer = MODE_SEQUENCE[0].duration;
  }

  /**
   * Called each frame with the elapsed time (ms).
   */
  public update(deltaMs: number): void {
    // Handle eaten (eye‑return) first – it overrides all other behaviour.
    if (this.state === GhostState.Eaten) {
      this.updateReturnHome(deltaMs);
      return;
    }

    // Frightened state handling.
    if (this.state === GhostState.Frightened) {
      this.frightenedTimer -= deltaMs;
      if (this.frightenedTimer <= 0) {
        // Return to the mode we were in before being frightened.
        this.state = this.previousMode;
        // Reset the mode timer to the remaining time of that mode.
        // For simplicity we restart the current mode duration.
        this.resetModeTimer();
      }
      // No further processing while frightened.
      return;
    }

    // Normal chase / scatter cycle.
    this.modeTimer -= deltaMs;
    if (this.modeTimer <= 0) {
      this.advanceMode();
    }
  }

  /**
   * Trigger the frightened (scared) state – called when Pac‑Man eats a power pellet.
   * The ghost reverses direction and moves at half speed.
   */
  public becomeFrightened(durationMs: number = 7_000): void {
    // Store the current mode so we can restore it later.
    if (this.state === GhostState.Chase || this.state === GhostState.Scatter) {
      this.previousMode = this.state;
    }
    this.state = GhostState.Frightened;
    this.frightenedTimer = durationMs;
    this.reverseDirection();
  }

  /**
   * Called when Pac‑Man eats the ghost while it is frightened.
   * The ghost enters the Eaten state and will return to its home.
   */
  public eat(): void {
    this.state = GhostState.Eaten;
    // Return home takes 2 seconds by default – can be tweaked.
    this.returnHomeTimer = 2_000;
    // Snap direction towards home – for simplicity we set direction to "up".
    this.direction = "up";
  }

  /**
   * Returns the current movement speed (pixels per second) taking the state into account.
   */
  public getSpeed(): number {
    if (this.state === GhostState.Frightened) {
      return this.baseSpeed * 0.5; // 50 % speed when frightened
    }
    if (this.state === GhostState.Eaten) {
      return this.baseSpeed * 1.2; // slightly faster when returning home (optional)
    }
    return this.baseSpeed;
  }

  /**
   * Reverse the current direction – used when entering frightened mode.
   */
  private reverseDirection(): void {
    const opposite: Record<Direction, Direction> = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };
    this.direction = opposite[this.direction];
  }

  /**
   * Advance to the next mode in the MODE_SEQUENCE.
   */
  private advanceMode(): void {
    this.modeIndex = (this.modeIndex + 1) % MODE_SEQUENCE.length;
    const next = MODE_SEQUENCE[this.modeIndex];
    this.state = next.state;
    this.resetModeTimer();
  }

  private resetModeTimer(): void {
    this.modeTimer = MODE_SEQUENCE[this.modeIndex].duration;
  }

  /**
   * Update the eye‑return animation while in the Eaten state.
   * For the purpose of the core logic we simply move the ghost towards its home position.
   */
  private updateReturnHome(deltaMs: number): void {
    this.returnHomeTimer -= deltaMs;
    // Simple linear interpolation towards home – not pixel‑perfect but sufficient for tests.
    const t = Math.min(1, deltaMs / this.returnHomeTimer);
    this.position.x += (this.homePosition.x - this.position.x) * t;
    this.position.y += (this.homePosition.y - this.position.y) * t;
    if (this.returnHomeTimer <= 0) {
      // Once home is reached, respawn in chase mode.
      this.state = GhostState.Chase;
      this.modeIndex = 0;
      this.resetModeTimer();
    }
  }
}
