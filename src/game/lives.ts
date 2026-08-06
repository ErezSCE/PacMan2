// src/game/lives.ts
/**
 * Lives service – tracks remaining lives for the player.
 *
 * The UI can query `getRemaining()` to display the count. When a life is lost
 * the `loseLife` method decrements the counter. If lives reach zero the game
 * over state can be handled by the engine (outside the scope of this PR).
 */
export class Lives {
  private remaining: number;

  constructor(initialLives: number = 3) {
    this.remaining = initialLives;
  }

  /** Decrement the lives counter. */
  public loseLife(): void {
    if (this.remaining > 0) {
      this.remaining -= 1;
    }
  }

  /** Get the current number of lives. */
  public getRemaining(): number {
    return this.remaining;
  }
}
