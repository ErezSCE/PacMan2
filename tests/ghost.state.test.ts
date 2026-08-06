import { Ghost, GhostState, Point } from "../src/game/ghost";

describe('Ghost state machine', () => {
  const startPos: Point = { x: 0, y: 0 };
  const homePos: Point = { x: 10, y: 10 };
  let ghost: Ghost;

  beforeEach(() => {
    ghost = new Ghost(startPos, homePos);
  });

  test('initial state is Chase', () => {
    expect(ghost.state).toBe(GhostState.Chase);
  });

  test('transitions from Chase to Scatter after chase duration', () => {
    // advance 7 seconds (7000 ms)
    ghost.update(7_000);
    expect(ghost.state).toBe(GhostState.Scatter);
  });

  test('full chase-scatter cycle returns to Chase', () => {
    // Chase 7s -> Scatter 5s -> Chase again
    ghost.update(7_000); // to Scatter
    expect(ghost.state).toBe(GhostState.Scatter);
    ghost.update(5_000); // to Chase
    expect(ghost.state).toBe(GhostState.Chase);
  });

  test('enter frightened state reverses direction and reduces speed', () => {
    const initialDirection = ghost.direction;
    ghost.becomeFrightened(5_000);
    expect(ghost.state).toBe(GhostState.Frightened);
    // direction should be opposite
    const opposite: Record<string, string> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };
    expect(ghost.direction).toBe(opposite[initialDirection]);
    // speed should be half of base speed (baseSpeed is private, but we can infer via getSpeed)
    expect(ghost.getSpeed()).toBeCloseTo(50); // baseSpeed is 100, half is 50
  });

  test('frightened state expires and returns to previous mode', () => {
    // Start in Chase, become frightened for 3 seconds
    ghost.becomeFrightened(3_000);
    expect(ghost.state).toBe(GhostState.Frightened);
    // advance 3 seconds
    ghost.update(3_000);
    // should revert to Chase (previous mode)
    expect(ghost.state).toBe(GhostState.Chase);
  });

  test('eaten ghost transitions to Eaten and then respawns after return home timer', () => {
    // First become frightened then eat
    ghost.becomeFrightened(5_000);
    ghost.eat();
    expect(ghost.state).toBe(GhostState.Eaten);
    // Simulate return home timer (2 seconds)
    ghost.update(2_000);
    expect(ghost.state).toBe(GhostState.Chase);
  });
});
