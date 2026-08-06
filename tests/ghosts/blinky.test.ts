import { Blinky, PacManInfo } from "../../src/game/ghosts/blinky";

describe('Blinky targeting logic', () => {
  test('targets Pac-Man current tile (rounded)', () => {
    const blinky = new Blinky({ x: 0, y: 0 }, { x: 0, y: 0 });
    const pacman: PacManInfo = { x: 5.3, y: 7.8, direction: 0 as any };
    const target = blinky.getTargetTile(pacman);
    expect(target).toEqual({ x: 5, y: 8 });
  });
});
