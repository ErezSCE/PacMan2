// src/game/score.ts
/**
 * Simple scoring service for Pac‑Man.
 *
 * It tracks the current point total and whether Pac‑Man is in scared mode
 * (triggered by eating a power‑pellet). The implementation is intentionally
 * lightweight – the UI layer can subscribe to changes via the public getters.
 */

export class Score {
  private points: number = 0;
  private scared: boolean = false;
  // Multiplier for ghost points after eating a power pellet.
  // Starts at 200 and doubles each ghost eaten, up to 1600.
  private ghostMultiplier: number = 200;

  /** Get the current ghost point multiplier. */
  public getGhostMultiplier(): number {
    return this.ghostMultiplier;
  }

  /** Call when a ghost is eaten to increase the multiplier. */
  public increaseGhostMultiplier(): void {
    this.ghostMultiplier = Math.min(this.ghostMultiplier * 2, 1600);
  }

  /** Reset multiplier after power‑pellet effect ends. */
  public resetGhostMultiplier(): void {
    this.ghostMultiplier = 200;
  }

  /** Add points to the total score. */
  public addPoints(value: number): void {
    this.points += value;
  }

  /** Enter scared mode (e.g., after eating a power‑pellet). */
  public enterScaredMode(): void {
    this.scared = true;
  }

  /** Exit scared mode – called by the game engine when the timer expires. */
  public exitScaredMode(): void {
    this.scared = false;
  }

  /** Get the current score. */
  public getPoints(): number {
    return this.points;
  }

  /** Whether Pac‑Man is currently in scared mode. */
  public isScared(): boolean {
    return this.scared;
  }
}
