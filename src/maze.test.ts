import { renderMaze, type Maze } from './maze';

describe('renderMaze', () => {
  it('should draw walls for cells with value 1', () => {
    const fillRectMock = jest.fn();
    const ctx = {
      fillStyle: '',
      fillRect: fillRectMock,
    } as unknown as CanvasRenderingContext2D;

    const maze: Maze = [
      [1, 0],
      [0, 1],
    ];
    const tileSize = 10;
    renderMaze(ctx, maze, tileSize);

    // Expect two calls for the two walls
    expect(fillRectMock).toHaveBeenCalledTimes(2);
    expect(fillRectMock).toHaveBeenCalledWith(0, 0, tileSize, tileSize); // first wall at (0,0)
    expect(fillRectMock).toHaveBeenCalledWith(10, 10, tileSize, tileSize); // second wall at (1,1)
  });
});
