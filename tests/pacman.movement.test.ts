import { PacMan, Direction } from '../src/game/pacman';
import { Score } from '../src/game/score';
import { Lives } from '../src/game/lives';
import type { Maze } from '../src/maze';

describe('PacMan movement and collision', () => {
  const createMaze = (): Maze => [
    // 0: empty, 1: wall
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];

  const score = new Score();
  const lives = new Lives();

  it('moves in the current direction', () => {
    const maze = createMaze();
    const pac = new PacMan(1, 1, score, lives, 5); // speed 5 tiles/sec
    pac.setDirection(Direction.Right);
    pac.update(0.2, maze); // move 1 tile (5 * 0.2)
    expect(pac.x).toBeCloseTo(2);
    expect(pac.y).toBeCloseTo(1);
    expect(pac.getDirection()).toBe(Direction.Right);
  });

  it('stops when colliding with a wall', () => {
    const maze = createMaze();
    const pac = new PacMan(1, 1, score, lives, 5);
    pac.setDirection(Direction.Left); // wall at (0,1)
    pac.update(0.2, maze);
    // Should remain at original tile (snapped) and direction cleared
    expect(pac.x).toBeCloseTo(1);
    expect(pac.y).toBeCloseTo(1);
    expect(pac.getDirection()).toBe(Direction.None);
  });

  it('applies pending direction when possible', () => {
    const maze = createMaze();
    const pac = new PacMan(2, 2, score, lives, 5);
    // Currently moving right, but we set pending up at an intersection
    pac.setDirection(Direction.Right);
    pac.update(0.1, maze); // move a bit to the right
    // Now request up direction
    pac.setDirection(Direction.Up);
    // Next update should switch to up because tile above is empty
    pac.update(0.1, maze);
    expect(pac.getDirection()).toBe(Direction.Up);
  });
});
