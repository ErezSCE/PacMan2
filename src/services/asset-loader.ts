/**
 * AssetLoader preloads game assets such as audio files.
 * It registers decoded AudioBuffers with the AudioManager.
 */

import { AudioManager, SoundName } from "./audio-manager";

export class AssetLoader {
  private static instance: AssetLoader;
  // Map of sound names to their file URLs. Adjust paths as needed.
  private soundFiles: Record<SoundName, string> = {
    dot: "/assets/audio/dot.wav",
    pellet: "/assets/audio/pellet.wav",
    ghostEat: "/assets/audio/ghostEat.wav",
    death: "/assets/audio/death.wav",
    fruit: "/assets/audio/fruit.wav",
    extraLife: "/assets/audio/extraLife.wav",
    siren: "/assets/audio/siren.wav",
  };

  private constructor() {}

  public static getInstance(): AssetLoader {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  /** Load all sound assets, decode them, and register with AudioManager. */
  public async loadAllSounds(): Promise<void> {
    const audioManager = AudioManager.getInstance();
    // Use a temporary AudioContext for decoding. AudioManager has its own context for playback.
    const decodeContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const loadPromises = Object.entries(this.soundFiles).map(async ([name, url]) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await decodeContext.decodeAudioData(arrayBuffer);
      audioManager.registerBuffer(name as SoundName, audioBuffer);
    });
    await Promise.all(loadPromises);
  }
}
