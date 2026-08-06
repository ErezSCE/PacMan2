import { CanvasManager } from '../src/render/canvas';

describe('CanvasManager', () => {
  let canvas: HTMLCanvasElement;
  let manager: CanvasManager;

  beforeEach(() => {
    // Create a canvas element with base dimensions 640x480
    canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    // Append to document body to allow getBoundingClientRect if needed
    document.body.appendChild(canvas);
    manager = new CanvasManager(canvas);
  });

  afterEach(() => {
    manager.destroy();
    document.body.removeChild(canvas);
  });

  it('calculates scale to fit within viewport while respecting min width', () => {
    // Mock window size smaller than base width to trigger scaling up to min 375px width
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 300 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 200 });
    // Trigger resize handler manually
    window.dispatchEvent(new Event('resize'));
    const expectedScale = 375 / 640; // min width constraint
    expect(manager.getScale()).toBeCloseTo(expectedScale);
    expect(canvas.style.width).toBe(`${640 * expectedScale}px`);
  });

  it('does not exceed max width constraint', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 5000 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 4000 });
    (manager as any).handleResize();
    const expectedScale = 2560 / 640; // max width constraint
    expect(manager.getScale()).toBeCloseTo(expectedScale);
    expect(canvas.style.width).toBe(`${640 * expectedScale}px`);
  });

  it('maintains aspect ratio within normal viewport', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
    (manager as any).handleResize();
    const rawScale = Math.min(800 / 640, 600 / 480);
    const clampedScale = Math.min(Math.max(rawScale, 375 / 640), 2560 / 640);
    expect(manager.getScale()).toBeCloseTo(clampedScale);
    expect(canvas.style.width).toBe(`${640 * clampedScale}px`);
    expect(canvas.style.height).toBe(`${480 * clampedScale}px`);
  });
});
