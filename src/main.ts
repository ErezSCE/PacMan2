import { renderMaze, type Maze } from './maze';

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
