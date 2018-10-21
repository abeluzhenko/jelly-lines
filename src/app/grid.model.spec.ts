import { Grid } from './grid.model';
import { BallState, BallColor } from './ball/ball.model';
import { ICell } from './cell/cell.model';

describe('Grid module', () => {
  it('getGrid should return a proper grid', () => {
    let grid: ICell[] = Grid.getGrid(9);
    expect(grid.length).toBe(81);
    expect(grid[50]).toEqual({ id: 50 });

    grid = Grid.getGrid(10);
    expect(grid.length).toBe(100);
    expect(grid[50]).toEqual({ id: 50 });
  });

  it('getMatches should return all the matches on the grid', () => {
    let grid: ICell[] = Grid.getGrid(9);
    let matches = Grid.getMatches(grid, 5);
    expect(matches).toEqual([]);

    // Horizontal
    grid = Grid.getGrid(9);
    for (let i = 0; i < 5; i++) {
      grid[i + 2].ball = { id: i + 2, state: BallState.idle, color: BallColor.blue };
      grid[i + 10].ball = { id: i + 10, state: BallState.idle, color: BallColor.red };
      grid[i + 15].ball = { id: i + 15, state: BallState.idle, color: BallColor.green };
    }
    matches = Grid.getMatches(grid, 5);
    expect(matches.length).toBe(2);
    expect(matches[0].length).toBe(5);
    expect(matches[0][0]).toEqual(grid[2]);
    expect(matches[0][4]).toEqual(grid[6]);

    expect(matches[1].length).toBe(5);
    expect(matches[1][0]).toEqual(grid[10]);
    expect(matches[1][4]).toEqual(grid[14]);

    grid = Grid.getGrid(9);
    for (let i = 0; i < 6; i++) {
      grid[i + 10].ball = { id: i + 10, state: BallState.idle, color: BallColor.red };
    }
    matches = Grid.getMatches(grid, 5);
    expect(matches.length).toBe(1);
    expect(matches[0].length).toBe(6);
    expect(matches[0][0]).toEqual(grid[10]);
    expect(matches[0][5]).toEqual(grid[15]);

    // Vertical
    grid = Grid.getGrid(9);
    for (let i = 0; i < 5; i++) {
      grid[i * 9 + 2].ball = { id: i * 9 + 2, state: BallState.idle, color: BallColor.blue };
      grid[i * 9 + 10].ball = { id: i * 9 + 10, state: BallState.idle, color: BallColor.red };
    }
    matches = Grid.getMatches(grid, 5);
    expect(matches.length).toBe(2);
    expect(matches[0].length).toBe(5);
    expect(matches[0][0]).toEqual(grid[2]);
    expect(matches[0][4]).toEqual(grid[38]);

    expect(matches[1].length).toBe(5);
    expect(matches[1][0]).toEqual(grid[10]);
    expect(matches[1][4]).toEqual(grid[46]);

    grid = Grid.getGrid(9);
    for (let i = 0; i < 6; i++) {
      grid[i * 9 + 10].ball = { id: i * 9 + 10, state: BallState.idle, color: BallColor.red };
    }
    matches = Grid.getMatches(grid, 5);
    expect(matches.length).toBe(1);
    expect(matches[0].length).toBe(6);
    expect(matches[0][0]).toEqual(grid[10]);
    expect(matches[0][5]).toEqual(grid[55]);

    // Diagonal
    grid = Grid.getGrid(9);
    for (let i = 0; i < 9; i++) {
      grid[(i + 1) * 8].ball = { id: (i + 1) * 8, state: BallState.idle, color: BallColor.red };
      grid[i * 10].ball = { id: i * 10, state: BallState.idle, color: BallColor.red };
    }
    matches = Grid.getMatches(grid, 5);
    expect(matches.length).toBe(2);
    expect(matches[0].length).toBe(9);
    expect(matches[0][0]).toEqual(grid[0]);
    expect(matches[0][8]).toEqual(grid[80]);

    expect(matches[1].length).toBe(9);
    expect(matches[1][0]).toEqual(grid[8]);
    expect(matches[1][8]).toEqual(grid[72]);
  });
});
