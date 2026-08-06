/**
 * CanvasManager – handles responsive resizing of the game canvas while preserving
 * the original aspect ratio (640×480). It also provides a scaling factor that can
 * be used by rendering code to adjust sprite sizes.
 */

export class CanvasManager {
  private readonly canvas: HTMLCanvasElement;
  private readonly baseWidth: number;
  private readonly baseHeight: number;
  private scale: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    // Preserve the original design dimensions from the canvas attributes.
    this.baseWidth = canvas.width;
    this.baseHeight = canvas.height;
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    // Initialise size immediately.
    this.handleResize();
  }

  /**
   * Returns the current scaling factor applied to the canvas.
   * Rendering code can multiply logical pixel sizes by this factor.
   */
  getScale(): number {
    return this.scale;
  }

  /**
   * Clean‑up listeners when the manager is no longer needed.
   */
  destroy(): void {
    window.removeEventListener('resize', this.handleResize);
  }

  /**
   * Resize the canvas to fit the viewport while keeping the original aspect ratio.
   * The visual size is constrained between 375 px and 2560 px as per the UI spec.
   */
  private handleResize(): void {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    // Compute the maximal uniform scale that fits both dimensions.
    const rawScale = Math.min(maxWidth / this.baseWidth, maxHeight / this.baseHeight);
    // Clamp the resulting width to the allowed range.
    const clampedScale = Math.min(
      Math.max(rawScale, 375 / this.baseWidth), // ensure at least 375 px width
      2560 / this.baseWidth // ensure no more than 2560 px width
    );
    this.scale = clampedScale;
    const visualWidth = this.baseWidth * this.scale;
    const visualHeight = this.baseHeight * this.scale;
    // Apply CSS size – the internal bitmap stays at the original resolution.
    this.canvas.style.width = `${visualWidth}px`;
    this.canvas.style.height = `${visualHeight}px`;
  }
}
