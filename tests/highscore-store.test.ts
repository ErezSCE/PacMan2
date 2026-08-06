import { getTop10, addScore, clearAll } from "../src/persistence/highscore-api";
import { HighScoreStore } from "../src/persistence/highscore-store";

/** Helper to reset the singleton store between tests */
async function resetStore() {
  // Clear all entries via API
  await clearAll();
  // Also reset the in‑memory fallback store directly (in case clearAll failed due to DB issues)
  const storeInstance = (HighScoreStore as any).getInstance();
  if (storeInstance.memoryStore) {
    storeInstance.memoryStore = [];
  }
}

describe("HighScoreStore API", () => {
  beforeEach(async () => {
    await resetStore();
  });

  it("should return the seeded default top‑10 scores when store is initially empty", async () => {
    const top = await getTop10();
    expect(Array.isArray(top)).toBe(true);
    expect(top).toHaveLength(10);
    // Verify that scores are sorted descending
    for (let i = 0; i < top.length - 1; i++) {
      expect(top[i].score).toBeGreaterThanOrEqual(top[i + 1].score);
    }
  });

  it("should add a high score and have it appear in the top‑10 list", async () => {
    await addScore("ABC", 12345);
    const top = await getTop10();
    // After seeding, there are already 10 entries; adding a higher score should keep length 10
    expect(top).toHaveLength(10);
    // The new high score should be the first entry (highest score)
    expect(top[0].initials).toBe("ABC");
    expect(top[0].score).toBe(12345);
  });

  it("should keep only the top 10 scores sorted descending", async () => {
    // Add 12 scores with varying values
    for (let i = 0; i < 12; i++) {
      await addScore(`P${i}`, i * 1000);
    }
    const top = await getTop10();
    expect(top).toHaveLength(10);
    // Scores should be sorted descending, highest first
    for (let i = 0; i < top.length - 1; i++) {
      expect(top[i].score).toBeGreaterThanOrEqual(top[i + 1].score);
    }
    // The highest score should be the last added (i=11 => 11000)
    expect(top[0].score).toBe(11000);
    // The lowest score in top‑10 should be 2000 (i=2)
    expect(top[9].score).toBe(2000);
  });

  it("should clear all scores", async () => {
    await addScore("XYZ", 5000);
    let top = await getTop10();
    expect(top).toHaveLength(1);
    await clearAll();
    top = await getTop10();
    expect(top).toHaveLength(0);
  });
});
