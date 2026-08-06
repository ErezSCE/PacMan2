import { initKeyboardInput } from '../src/input/keyboard';
import { initTouchInput } from '../src/input/touch';
import { Direction } from '../src/input/direction';

describe('Input Handler Normalization', () => {
  test('keyboard arrow keys map to directions', () => {
    const callback = jest.fn();
    const cleanup = initKeyboardInput(callback);
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    window.dispatchEvent(event);
    expect(callback).toHaveBeenCalledWith(Direction.Up);
    cleanup();
  });

  test('WASD keys map to directions (case insensitive)', () => {
    const callback = jest.fn();
    const cleanup = initKeyboardInput(callback);
    const keys = [
      { key: 'w', dir: Direction.Up },
      { key: 'a', dir: Direction.Left },
      { key: 'S', dir: Direction.Down },
      { key: 'D', dir: Direction.Right },
    ];
    keys.forEach(({ key, dir }) => {
      const ev = new KeyboardEvent('keydown', { key });
      window.dispatchEvent(ev);
      expect(callback).toHaveBeenLastCalledWith(dir);
    });
    cleanup();
  });

  test('touch swipe maps to directions', () => {
    const callback = jest.fn();
    const cleanup = initTouchInput(callback);
    // simulate right swipe
    const down = new MouseEvent('pointerdown', { clientX: 0, clientY: 0, bubbles: true, cancelable: true });
    const up = new MouseEvent('pointerup', { clientX: 100, clientY: 0, bubbles: true, cancelable: true });
    window.dispatchEvent(down);
    window.dispatchEvent(up);
    expect(callback).toHaveBeenCalledWith(Direction.Right);
    // simulate up swipe
    const down2 = new PointerEvent('pointerdown', { clientX: 0, clientY: 100, isPrimary: true });
    const up2 = new PointerEvent('pointerup', { clientX: 0, clientY: 0, isPrimary: true });
    window.dispatchEvent(down2);
    window.dispatchEvent(up2);
    expect(callback).toHaveBeenCalledWith(Direction.Up);
    cleanup();
  });
});
