/**
 * HighScoreStore provides CRUD operations for the top‑10 high scores using IndexedDB via the idb library.
 * It falls back to an in‑memory store when IndexedDB is unavailable (e.g., during tests).
 * The store is seeded with default scores on first use unless `clearAll` has been called.
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
  // Flag to ensure initial seeding occurs only once
  private seeded: boolean = false;
  // In‑memory fallback store used when IndexedDB is unavailable (e.g., in test environment)
  private memoryStore: HighScore[] = [];
  // Flag indicating that `clearAll` was called; prevents automatic reseeding of defaults
  private cleared: boolean = false;

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
      });
    }
    return this.dbPromise;
  }

  /** Seed the store with the default top‑10 scores. */
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

  /** Seed the in‑memory fallback store with the same default scores. */
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
      const all = (await db.getAll("high_scores")) as HighScore[];
      if (all.length === 0 && !this.cleared && !this.seeded) {
        // Seed defaults only once
        await this.seedInitialData(db);
        this.seeded = true;
        const seeded = (await db.getAll("high_scores")) as HighScore[];
        return seeded.sort((a, b) => b.score - a.score);
      }
      return all.sort((a, b) => b.score - a.score);
    } catch {
      // IndexedDB unavailable – use in‑memory fallback
      if (this.memoryStore.length === 0 && !this.cleared) {
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

  /** Add a new score. */
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
      // Keep only top 10 scores
      const all = (await db.getAll("high_scores")) as HighScore[];
      const sorted = all.sort((a, b) => b.score - a.score);
      if (sorted.length > 10) {
        const tx = db.transaction("high_scores", "readwrite");
        const store = tx.objectStore("high_scores");
        for (let i = 10; i < sorted.length; i++) {
          const id = sorted[i].id;
          if (id !== undefined) await store.delete(id);
        }
        await tx.done;
      }
    } catch {
      // Fallback to in‑memory store
      this.memoryStore.push({ ...record, id: this.memoryStore.length + 1 });
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
      // Set cleared flag only after successful DB clear
      this.cleared = true;
    } catch {
      // ignore DB errors – fallback will still clear memory store
    }
    // Also clear the in‑memory fallback store
    this.memoryStore = [];
    // Reset seeded flag so that future getAll can attempt seeding if needed
    this.seeded = false;
  }
}
