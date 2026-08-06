import { Direction } from './direction';

/**
 * Initialise keyboard input handling.
 * Listens for Arrow keys and WASD and forwards the corresponding {@link Direction}
 * to the supplied callback.
 *
 * @param onDirection - Callback invoked with the normalized direction.
 * @returns A cleanup function that removes the event listener.
 */
export function initKeyboardInput(onDirection: (dir: Direction) => void): () => void {
  const handler = (e: KeyboardEvent) => {
    let dir: Direction | undefined;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        dir = Direction.Up;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        dir = Direction.Down;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        dir = Direction.Left;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        dir = Direction.Right;
        break;
    }
    if (dir) {
      e.preventDefault();
      onDirection(dir);
    }
  };

  window.addEventListener('keydown', handler);
  // Return cleanup function
  return () => window.removeEventListener('keydown', handler);
}
