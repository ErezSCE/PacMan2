import { Direction } from './direction';

/**
 * Initialise touch (or pointer) input handling.
 * Detects swipe gestures and forwards the corresponding {@link Direction}
 * to the supplied callback.
 *
 * @param onDirection - Callback invoked with the normalized direction.
 * @returns A cleanup function that removes the event listeners.
 */
export function initTouchInput(onDirection: (dir: Direction) => void): () => void {
  let startX = 0;
  let startY = 0;
  const threshold = 30; // minimum pixels to consider a swipe

  const downHandler = (e: PointerEvent) => {
    // Only consider primary pointer (touch) interactions
    if (e.isPrimary) {
      startX = e.clientX;
      startY = e.clientY;
    }
  };

  const upHandler = (e: PointerEvent) => {
    if (!e.isPrimary) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return; // ignore tiny moves
    let dir: Direction | undefined;
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      dir = dx > 0 ? Direction.Right : Direction.Left;
    } else {
      // Vertical swipe
      dir = dy > 0 ? Direction.Down : Direction.Up;
    }
    if (dir) {
      onDirection(dir);
    }
  };

  window.addEventListener('pointerdown', downHandler);
  window.addEventListener('pointerup', upHandler);

  return () => {
    window.removeEventListener('pointerdown', downHandler);
    window.removeEventListener('pointerup', upHandler);
  };
}
