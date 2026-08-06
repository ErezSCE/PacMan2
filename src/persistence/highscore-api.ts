/**
 * Thin API layer exposing HighScoreStore functionality to UI components.
 * This decouples the UI from the underlying persistence implementation.
 */

import { HighScore, HighScoreStore } from "./highscore-store";

/** Retrieve the top 10 high scores. */
export async function getTop10(): Promise<HighScore[]> {
  return await HighScoreStore.getInstance().getTop10();
}

/** Add a new high score entry. */
export async function addScore(initials: string, score: number): Promise<void> {
  await HighScoreStore.getInstance().addScore(initials, score);
}

/** Clear all high scores (used for testing or resetting). */
export async function clearAll(): Promise<void> {
  await HighScoreStore.getInstance().clearAll();
}
