import { Grid } from './grid.model';
import { BallState, BallColor } from './ball/ball.model';
import { ICell } from './cell/cell.model';

fdescribe('Grid module', () => {
  it('getGrid should return a proper grid', () => {

  });
  it('getRandomGrid should return a proper randomized grid', () => {

  });
  it('getRandomColor should return a random color from the colors set', () => {

  });
  fit('getMatches should return all the matches on the grid', () => {
    const grid: ICell[] = Grid.getGrid(9);
    let matches = Grid.getMatches(grid, 5);
    expect(matches).toEqual([]);

    // Horizontal
    for (let i = 0; i < 5; i++) {
      grid[i].ball = { id: i, state: BallState.idle, color: BallColor.blue };
    }
    matches = Grid.getMatches(grid, 5);
    expect(matches.length).toBe(1);
    expect(matches[0].length).toBe(5);
    expect(matches[0][0]).toBe(grid[0]);
    expect(matches[0][4]).toBe(grid[4]);
  });
});
