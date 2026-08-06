// SettingsStore provides a simple key-value persistence using IndexedDB via the idb library.
// It falls back to an in‑memory Map when IndexedDB is unavailable (e.g., during tests).

import { openDB, IDBPDatabase } from "idb";

export type SettingValue = string | number | boolean;

interface SettingsSchema {
  key: string;
  value: SettingValue;
  created_at: number;
  updated_at: number;
}

export class SettingsStore {
  private static instance: SettingsStore;
  private dbPromise: Promise<IDBPDatabase<unknown>> | null = null;
  private memoryStore: Map<string, SettingValue> = new Map();

  private constructor() {}

  public static getInstance(): SettingsStore {
    if (!SettingsStore.instance) {
      SettingsStore.instance = new SettingsStore();
    }
    return SettingsStore.instance;
  }

  private async getDB() {
    if (!this.dbPromise) {
      this.dbPromise = openDB("pacman2-db", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("settings")) {
            const store = db.createObjectStore("settings", { keyPath: "key" });
            store.createIndex("by-key", "key");
          }
        },
      });
    }
    return this.dbPromise;
  }

  public async get(key: string): Promise<SettingValue | undefined> {
    try {
      const db = await this.getDB();
      const result = await db.get("settings", key);
      return result?.value;
    } catch (e) {
      // Fallback to memory store when IndexedDB fails (e.g., in test environment)
      return this.memoryStore.get(key);
    }
  }

  public async set(key: string, value: SettingValue): Promise<void> {
    const timestamp = Date.now();
    const record = { key, value, created_at: timestamp, updated_at: timestamp } as SettingsSchema;
    try {
      const db = await this.getDB();
      await db.put("settings", record);
    } catch (e) {
      // Fallback to memory store
      this.memoryStore.set(key, value);
    }
  }
}
