/**
 * HighScoreStore provides CRUD operations for the top‑10 high scores using IndexedDB via the idb library.
 * It falls back to an in‑memory store when IndexedDB is unavailable (e.g., during tests).
 * The store is seeded with initial data on first launch if empty.
 */

import { openDB, IDBPDatabase } from "idb";

export interface HighScore {
  id?: number; // auto‑generated primary key
  initials: string; // three‑letter player initials
  score: number;
  created_at: number;
  updated_at: number;
}

export class HighScoreStore {
  private static instance: HighScoreStore;
  private dbPromise: Promise<IDBPDatabase<unknown>> | null = null;
  // In‑memory fallback store
  private memoryStore: HighScore[] = [];

  private constructor() {}

  public static getInstance(): HighScoreStore {
    if (!HighScoreStore.instance) {
      HighScoreStore.instance = new HighScoreStore();
    }
    return HighScoreStore.instance;
  }

  /** Open (or create) the IndexedDB database and object store. */
  private async getDB(): Promise<IDBPDatabase<unknown>> {
    if (!this.dbPromise) {
      this.dbPromise = openDB("pacman2-db", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("high_scores")) {
            const store = db.createObjectStore("high_scores", {
              keyPath: "id",
              autoIncrement: true,
            });
            store.createIndex("by-score", "score");
          }
        },
      }).then(async (db) => {
        // Seed if empty
        const count = await db.count("high_scores");
        if (count === 0) {
          await this.seedInitialData(db);
        }
        return db;
      });
    }
    return this.dbPromise;
  }

  /** Seed the store with 10 default scores when it is empty. */
  private async seedInitialData(db: IDBPDatabase<unknown>) {
    const defaultScores: Omit<HighScore, "id">[] = [
      { initials: "AAA", score: 10000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "BBB", score: 9000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "CCC", score: 8000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "DDD", score: 7000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "EEE", score: 6000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "FFF", score: 5000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "GGG", score: 4000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "HHH", score: 3000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "III", score: 2000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "JJJ", score: 1000, created_at: Date.now(), updated_at: Date.now() },
    ];
    const tx = db.transaction("high_scores", "readwrite");
    const store = tx.objectStore("high_scores");
    for (const rec of defaultScores) {
      await store.add(rec);
    }
    await tx.done;
  }

  /** Seed the in‑memory fallback store with default scores. */
  private async seedMemoryDefaults() {
    const defaultScores: Omit<HighScore, "id">[] = [
      { initials: "AAA", score: 10000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "BBB", score: 9000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "CCC", score: 8000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "DDD", score: 7000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "EEE", score: 6000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "FFF", score: 5000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "GGG", score: 4000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "HHH", score: 3000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "III", score: 2000, created_at: Date.now(), updated_at: Date.now() },
      { initials: "JJJ", score: 1000, created_at: Date.now(), updated_at: Date.now() },
    ];
    this.memoryStore = defaultScores.map((rec, idx) => ({ ...rec, id: idx + 1 }));
  }

  /** Retrieve all scores sorted descending by score. */
  private async getAll(): Promise<HighScore[]> {
    try {
      const db = await this.getDB();
      const all = await db.getAll("high_scores");
      return (all as HighScore[]).sort((a, b) => b.score - a.score);
    } catch (e) {
      // Fallback to memory store; seed defaults if empty
      if (this.memoryStore.length === 0) {
        await this.seedMemoryDefaults();
      }
      return [...this.memoryStore].sort((a, b) => b.score - a.score);
    }
  }

  /** Get the top 10 scores. */
  public async getTop10(): Promise<HighScore[]> {
    const all = await this.getAll();
    return all.slice(0, 10);
  }

  /** Add a new score. If the list exceeds 10 entries, the lowest scores are retained but UI can filter top‑10. */
  public async addScore(initials: string, score: number): Promise<void> {
    const now = Date.now();
    const record: Omit<HighScore, "id"> = {
      initials: initials.slice(0, 3).toUpperCase(),
      score,
      created_at: now,
      updated_at: now,
    };
    try {
      const db = await this.getDB();
      await db.add("high_scores", record);
      // Ensure only top 10 scores are kept
      const all = await db.getAll("high_scores");
      const sorted = (all as HighScore[]).sort((a, b) => b.score - a.score);
      if (sorted.length > 10) {
        const toDelete = sorted.slice(10);
        const tx = db.transaction("high_scores", "readwrite");
        const store = tx.objectStore("high_scores");
        for (const entry of toDelete) {
          if (entry.id !== undefined) {
            await store.delete(entry.id);
          }
        }
        await tx.done;
      }
    } catch (e) {
      // Fallback to memory store
      this.memoryStore.push({ ...record, id: this.memoryStore.length + 1 });
      // Trim memory store to top 10
      this.memoryStore.sort((a, b) => b.score - a.score);
      if (this.memoryStore.length > 10) {
        this.memoryStore = this.memoryStore.slice(0, 10);
      }
    }
  }

  /** Clear all stored scores. */
  public async clearAll(): Promise<void> {
    try {
      const db = await this.getDB();
      await db.clear("high_scores");
      // Reseed defaults after clearing to maintain initial top‑10
      await this.seedInitialData(db);
    } catch (e) {
      // Fallback: reset memory store to defaults
      await this.seedMemoryDefaults();
    }
  }
}
