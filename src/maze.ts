/**
 * Maze data structure and rendering utilities.
 *
 * The maze is represented as a two‑dimensional grid of numbers.
 *   0 – empty space (walkable)
 *   1 – wall (solid)
 *
 * The renderMaze function draws the maze onto a provided CanvasRenderingContext2D.
 * It currently renders walls as solid black rectangles. In the future this can be
 * extended to use a sprite sheet for more elaborate graphics.
 */

export type Maze = number[][];

/**
 * Render a maze onto a canvas context.
 *
 * @param ctx - Canvas 2D rendering context.
 * @param maze - Two‑dimensional array representing the maze layout.
 * @param tileSize - Size of each tile in pixels.
 */
export function renderMaze(
  ctx: CanvasRenderingContext2D,
  maze: Maze,
  tileSize: number,
): void {
  const rows = maze.length;
  const cols = maze[0]?.length ?? 0;

  // Simple rendering: walls are black squares, empty tiles are left transparent.
  ctx.fillStyle = '#000';

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
}
