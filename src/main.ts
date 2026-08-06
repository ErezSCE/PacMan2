// main.ts -- Pac-Man Game

import { Direction as InputDir } from './input/direction';
import { initKeyboardInput } from './input/keyboard';
import { initTouchInput } from './input/touch';
import { PacMan, Direction as PacDir } from './game/pacman';
import { Score } from './game/score';
import { Lives } from './game/lives';

// ============================================================================
// Constants
// ============================================================================

const TILE = 24;

// Maze cell values: 0 = empty, 1 = wall, 2 = dot, 3 = power pellet
const MAZE_TEMPLATE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,3,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,3,1],
  [1,2,1,1,2,1,1,1,2,2,1,2,2,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,2,2,2,2,2,1,1,1,2,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,2,2,2,2,2,1,1,1,2,1,1,1,1],
  [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,2,1,2,2,1,1,1,2,1,1,2,1],
  [1,3,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const COLS = MAZE_TEMPLATE[0].length;
const ROWS = MAZE_TEMPLATE.length;
const OFFSET_X = Math.floor((640 - COLS * TILE) / 2);
const OFFSET_Y = 36;

const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];
const GHOST_STARTS: [number, number][] = [[8, 7], [10, 7], [12, 7], [10, 3]];
const PAC_START: [number, number] = [10, 11];

// ============================================================================
// Direction helpers (bridges string-based input enum to numeric PacMan enum)
// ============================================================================

const DIR_BRIDGE: Record<string, PacDir> = {
  [InputDir.Up]: PacDir.Up,
  [InputDir.Down]: PacDir.Down,
  [InputDir.Left]: PacDir.Left,
  [InputDir.Right]: PacDir.Right,
};

function dirDelta(d: PacDir): [number, number] {
  switch (d) {
    case PacDir.Up: return [0, -1];
    case PacDir.Down: return [0, 1];
    case PacDir.Left: return [-1, 0];
    case PacDir.Right: return [1, 0];
    default: return [0, 0];
  }
}

function oppositeDir(d: PacDir): PacDir {
  switch (d) {
    case PacDir.Up: return PacDir.Down;
    case PacDir.Down: return PacDir.Up;
    case PacDir.Left: return PacDir.Right;
    case PacDir.Right: return PacDir.Left;
    default: return PacDir.None;
  }
}

// ============================================================================
// Maze
// ============================================================================

let maze: number[][];

function resetMaze(): void {
  maze = MAZE_TEMPLATE.map(r => [...r]);
}

function walkable(tx: number, ty: number): boolean {
  if (ty < 0 || ty >= ROWS || tx < 0 || tx >= COLS) return false;
  return maze[ty][tx] !== 1;
}

function dotsRemaining(): number {
  let n = 0;
  for (const row of maze)
    for (const c of row) if (c === 2 || c === 3) n++;
  return n;
}

// ============================================================================
// Ghost
// ============================================================================

interface SimpleGhost {
  x: number; y: number;
  dir: PacDir;
  speed: number;
  color: string;
  state: 'normal' | 'frightened';
  frightenedTimer: number;
  homeX: number; homeY: number;
}

function makeGhost(x: number, y: number, color: string): SimpleGhost {
  return {
    x, y, dir: PacDir.Left, speed: 3.5, color,
    state: 'normal', frightenedTimer: 0, homeX: x, homeY: y,
  };
}

function availableDirs(tx: number, ty: number, exclude: PacDir): PacDir[] {
  const dirs: PacDir[] = [];
  for (const d of [PacDir.Up, PacDir.Down, PacDir.Left, PacDir.Right]) {
    if (d === exclude) continue;
    const [dx, dy] = dirDelta(d);
    if (walkable(tx + dx, ty + dy)) dirs.push(d);
  }
  return dirs;
}

function pickGhostDir(g: SimpleGhost, px: number, py: number): PacDir {
  const tx = Math.round(g.x), ty = Math.round(g.y);
  const rev = oppositeDir(g.dir);
  let opts = availableDirs(tx, ty, rev);
  if (opts.length === 0) opts = availableDirs(tx, ty, PacDir.None);
  if (opts.length === 0) return PacDir.None;

  if (g.state === 'frightened') {
    return opts[Math.floor(Math.random() * opts.length)];
  }

  // Chase: pick direction that moves closest to Pac-Man
  let best = opts[0], bestDist = Infinity;
  for (const d of opts) {
    const [dx, dy] = dirDelta(d);
    const dist = (tx + dx - px) ** 2 + (ty + dy - py) ** 2;
    if (dist < bestDist) { bestDist = dist; best = d; }
  }
  return best;
}

function updateGhost(g: SimpleGhost, dt: number, px: number, py: number): void {
  if (g.state === 'frightened') {
    g.frightenedTimer -= dt;
    if (g.frightenedTimer <= 0) g.state = 'normal';
  }

  const spd = g.state === 'frightened' ? g.speed * 0.5 : g.speed;
  const threshold = Math.max(spd * dt, 0.1);

  // At tile center: snap and choose new direction
  if (Math.abs(g.x - Math.round(g.x)) < threshold &&
      Math.abs(g.y - Math.round(g.y)) < threshold) {
    g.x = Math.round(g.x);
    g.y = Math.round(g.y);
    g.dir = pickGhostDir(g, px, py);
  }

  const [dx, dy] = dirDelta(g.dir);
  if (dx === 0 && dy === 0) return;

  const nx = g.x + dx * spd * dt;
  const ny = g.y + dy * spd * dt;

  // Wall check: look at the tile the ghost would enter
  const checkX = dx > 0 ? Math.ceil(nx) : dx < 0 ? Math.floor(nx) : Math.round(nx);
  const checkY = dy > 0 ? Math.ceil(ny) : dy < 0 ? Math.floor(ny) : Math.round(ny);

  if (walkable(checkX, checkY)) {
    g.x = nx;
    g.y = ny;
  } else {
    g.x = Math.round(g.x);
    g.y = Math.round(g.y);
    g.dir = pickGhostDir(g, px, py);
  }
}

// ============================================================================
// Rendering
// ============================================================================

function drawMaze(ctx: CanvasRenderingContext2D): void {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const px = OFFSET_X + x * TILE;
      const py = OFFSET_Y + y * TILE;
      const cell = maze[y][x];
      if (cell === 1) {
        ctx.fillStyle = '#2121DE';
        ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
      } else if (cell === 2) {
        ctx.fillStyle = '#FFB8AE';
        ctx.beginPath();
        ctx.arc(px + TILE / 2, py + TILE / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (cell === 3) {
        ctx.fillStyle = '#FFB8AE';
        ctx.beginPath();
        ctx.arc(px + TILE / 2, py + TILE / 2, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawPacMan(ctx: CanvasRenderingContext2D, pm: PacMan, mouth: number): void {
  const px = OFFSET_X + pm.x * TILE + TILE / 2;
  const py = OFFSET_Y + pm.y * TILE + TILE / 2;
  const r = TILE / 2 - 2;
  const d = pm.getDirection();

  let angle = 0;
  if (d === PacDir.Right || d === PacDir.None) angle = 0;
  else if (d === PacDir.Down) angle = Math.PI / 2;
  else if (d === PacDir.Left) angle = Math.PI;
  else if (d === PacDir.Up) angle = -Math.PI / 2;

  ctx.fillStyle = '#FFFF00';
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.arc(px, py, r, angle + mouth, angle + Math.PI * 2 - mouth);
  ctx.closePath();
  ctx.fill();
}

function drawGhostSprite(ctx: CanvasRenderingContext2D, g: SimpleGhost): void {
  const px = OFFSET_X + g.x * TILE + TILE / 2;
  const py = OFFSET_Y + g.y * TILE + TILE / 2;
  const r = TILE / 2 - 2;
  const color = g.state === 'frightened' ? '#2121FF' : g.color;

  // Body: rounded top + flat bottom
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(px, py - 2, r, Math.PI, 0);
  ctx.lineTo(px + r, py + r);
  ctx.lineTo(px - r, py + r);
  ctx.closePath();
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(px - 3, py - 4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + 3, py - 4, 3, 0, Math.PI * 2);
  ctx.fill();

  if (g.state !== 'frightened') {
    ctx.fillStyle = '#00008B';
    ctx.beginPath();
    ctx.arc(px - 3, py - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px + 3, py - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHUD(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('SCORE: ' + score.getPoints(), OFFSET_X, 24);
  ctx.textAlign = 'right';
  ctx.fillText('LIVES: ' + lives.getRemaining(), OFFSET_X + COLS * TILE, 24);
}

function drawOverlay(
  ctx: CanvasRenderingContext2D,
  text: string,
  color: string,
  sub: string,
): void {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, 640, 480);
  ctx.fillStyle = color;
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, 320, 220);
  ctx.fillStyle = '#FFF';
  ctx.font = '16px monospace';
  ctx.fillText(sub, 320, 260);
}

// ============================================================================
// Game state
// ============================================================================

type GameState = 'ready' | 'playing' | 'died' | 'gameover' | 'win';
let state: GameState = 'ready';
let score: Score;
let lives: Lives;
let pacman: PacMan;
let ghosts: SimpleGhost[];
let lastTime = 0;
let mouthAngle = 0;
let mouthVel = 8;
let diedTimer = 0;

function initGame(): void {
  resetMaze();
  score = new Score();
  lives = new Lives(3);
  pacman = new PacMan(PAC_START[0], PAC_START[1], score, lives, 5);
  ghosts = GHOST_STARTS.map((pos, i) =>
    makeGhost(pos[0], pos[1], GHOST_COLORS[i]),
  );
  state = 'playing';
  lastTime = 0;
}

function resetPositions(): void {
  pacman = new PacMan(PAC_START[0], PAC_START[1], score, lives, 5);
  for (const g of ghosts) {
    g.x = g.homeX;
    g.y = g.homeY;
    g.state = 'normal';
    g.dir = PacDir.Left;
  }
}

// ============================================================================
// Setup
// ============================================================================

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Initialize for the ready screen
resetMaze();
score = new Score();
lives = new Lives(3);
pacman = new PacMan(PAC_START[0], PAC_START[1], score, lives, 5);
ghosts = GHOST_STARTS.map((pos, i) =>
  makeGhost(pos[0], pos[1], GHOST_COLORS[i]),
);

// Keyboard & touch input
initKeyboardInput((d) => {
  if (state === 'playing') pacman.setDirection(DIR_BRIDGE[d]);
});
initTouchInput((d) => {
  if (state === 'playing') pacman.setDirection(DIR_BRIDGE[d]);
});

// Space to start / restart
window.addEventListener('keydown', (e) => {
  if (
    e.key === ' ' &&
    (state === 'ready' || state === 'gameover' || state === 'win')
  ) {
    e.preventDefault();
    initGame();
  }
});

// ============================================================================
// Game loop
// ============================================================================

function loop(time: number): void {
  const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
  lastTime = time;

  // --- Update ---
  if (state === 'playing') {
    // Move Pac-Man (handles dots & power pellet collection internally)
    pacman.update(dt, maze);

    // Detect power pellet eaten (PacMan sets score.isScared())
    if (score.isScared()) {
      for (const g of ghosts) {
        if (g.state === 'normal') {
          g.state = 'frightened';
          g.frightenedTimer = 7;
          g.dir = oppositeDir(g.dir);
        }
      }
      score.exitScaredMode();
    }

    // Move ghosts
    for (const g of ghosts) updateGhost(g, dt, pacman.x, pacman.y);

    // Ghost-PacMan collisions
    for (const g of ghosts) {
      const dist = Math.abs(g.x - pacman.x) + Math.abs(g.y - pacman.y);
      if (dist < 0.7) {
        if (g.state === 'frightened') {
          score.addPoints(200);
          g.x = g.homeX;
          g.y = g.homeY;
          g.state = 'normal';
        } else {
          lives.loseLife();
          if (lives.getRemaining() <= 0) {
            state = 'gameover';
          } else {
            state = 'died';
            diedTimer = 1.5;
          }
          break;
        }
      }
    }

    if (dotsRemaining() === 0) state = 'win';
  } else if (state === 'died') {
    diedTimer -= dt;
    if (diedTimer <= 0) {
      resetPositions();
      state = 'playing';
    }
  }

  // --- Render ---
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 640, 480);
  drawMaze(ctx);

  // Pac-Man mouth animation
  mouthAngle += mouthVel * dt;
  if (mouthAngle > 0.4) { mouthAngle = 0.4; mouthVel = -Math.abs(mouthVel); }
  if (mouthAngle < 0.02) { mouthAngle = 0.02; mouthVel = Math.abs(mouthVel); }

  if (state !== 'died') drawPacMan(ctx, pacman, mouthAngle);
  for (const g of ghosts) drawGhostSprite(ctx, g);
  drawHUD(ctx);

  if (state === 'ready') {
    drawOverlay(ctx, 'PAC-MAN', '#FFFF00', 'Press SPACE to start');
  } else if (state === 'gameover') {
    drawOverlay(ctx, 'GAME OVER', '#FF0000', 'Press SPACE to restart');
  } else if (state === 'win') {
    drawOverlay(ctx, 'YOU WIN!', '#00FF00', 'Press SPACE to play again');
  } else if (state === 'died') {
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('OUCH!', 320, 240);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
