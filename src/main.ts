import { renderMaze, type Maze } from './maze';
import { CanvasManager } from './render/canvas';
import OnscreenControls from './ui/onscreen-controls';
import { AudioManager } from './services/audio-manager';
import { AssetLoader } from './services/asset-loader';
import MuteToggle from './ui/mute-toggle';
import { AudioManager } from './services/audio-manager';
import { AssetLoader } from './services/asset-loader';
import MuteToggle from './ui/mute-toggle';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
if (!ctx) {
  throw new Error('Canvas 2D context not available');
}

// Simple example maze: 0 = empty, 1 = wall
const exampleMaze: Maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],
  [1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

renderMaze(ctx, exampleMaze, 32);
