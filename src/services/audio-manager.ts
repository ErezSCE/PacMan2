/**
 * AudioManager handles playback of game sound effects using the Web Audio API.
 * It supports mute/unmute with persistence via SettingsStore and dynamic siren pitch.
 */

import { SettingsStore } from "./settings-store";

export type SoundName =
  | "dot"
  | "pellet"
  | "ghostEat"
  | "death"
  | "fruit"
  | "extraLife"
  | "siren";

export class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext;
  private buffers: Map<SoundName, AudioBuffer> = new Map();
  private muted: boolean = false;
  private sirenRate: number = 1.0; // default playbackRate

  private constructor() {
    // Create a single AudioContext; browsers may require user interaction before playback.
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /** Initialize manager: load persisted mute state. */
  public async init(): Promise<void> {
    const stored = await SettingsStore.getInstance().get("audioMuted");
    this.muted = stored === true; // stored may be undefined
  }

  /** Register a decoded AudioBuffer for a sound name. */
  public registerBuffer(name: SoundName, buffer: AudioBuffer): void {
    this.buffers.set(name, buffer);
  }

  /** Play a sound effect if not muted. */
  public play(name: SoundName): void {
    if (this.muted) return;
    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`AudioManager: buffer for ${name} not loaded`);
      return;
    }
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    // Apply siren pitch if playing siren
    if (name === "siren") {
      source.playbackRate.value = this.sirenRate;
    }
    source.connect(this.audioContext.destination);
    source.start(0);
  }

  /** Toggle mute state and persist it. */
  public async toggleMute(): Promise<void> {
    this.muted = !this.muted;
    await SettingsStore.getInstance().set("audioMuted", this.muted);
  }

  public async setMute(muted: boolean): Promise<void> {
    this.muted = muted;
    await SettingsStore.getInstance().set("audioMuted", this.muted);
  }

  public isMuted(): boolean {
    return this.muted;
  }

  /** Adjust siren playback rate based on remaining dots.
   *  The rate increases as remaining dots decrease.
   */
  public setSirenPitch(remainingDots: number, totalDots: number): void {
    if (totalDots <= 0) {
      this.sirenRate = 1.0;
      return;
    }
    const progress = 1 - remainingDots / totalDots; // 0 -> start, 1 -> end
    // Increase up to 1.5x speed at the end of the level.
    this.sirenRate = 1 + progress * 0.5;
  }
}
