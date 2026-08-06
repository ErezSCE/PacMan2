import { Pinky, PacManInfo } from "../../src/game/ghosts/pinky";
import { Direction as PacManDirection } from "../../src/game/pacman";

describe('Pinky targeting logic', () => {
  test('targets four tiles ahead of Pac-Man direction', () => {
    const pinky = new Pinky({ x: 0, y: 0 }, { x: 0, y: 0 });
    const pacman: PacManInfo = { x: 5, y: 5, direction: PacManDirection.Right };
    const target = pinky.getTargetTile(pacman);
    // Four tiles to the right of (5,5) => (9,5)
    expect(target).toEqual({ x: 9, y: 5 });
  });
});
