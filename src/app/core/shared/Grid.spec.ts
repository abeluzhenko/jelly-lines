import { Grid } from './Grid';
import { BallState, BallColor } from './Ball';
import { Cell } from './Cell';

describe('Grid module', () => {
  it('getGrid should return a proper grid', () => {
    let grid: Cell[] = Grid.getGrid(9);
    expect(grid.length).toBe(81);
    expect(grid[50]).toEqual({ id: 50 });

    grid = Grid.getGrid(10);
    expect(grid.length).toBe(100);
    expect(grid[50]).toEqual({ id: 50 });
  });

  it('getMatches should properly process zero matches', () => {
    const grid: Cell[] = Grid.getGrid(9);
    const matches = Grid.getMatches(grid, 5);
    expect(matches).toEqual([]);
  });

  it('getMatches should return all the horizontal matches on the grid', () => {
    let grid = Grid.getGrid(9);
    for (let i = 0; i < 5; i++) {
      grid[i + 2].ball = { id: i + 2, state: BallState.idle, color: BallColor.blue };
      grid[i + 10].ball = { id: i + 10, state: BallState.idle, color: BallColor.red };
      grid[i + 15].ball = { id: i + 15, state: BallState.idle, color: BallColor.green };
      grid[i + 30].ball = { id: i + 30, state: BallState.idle, color: BallColor.green };
    }
    grid[29].ball = grid[30].ball;
    grid[30] = { id: 30 };

    grid[8] = {id : 8, ball: { id: 8, state: BallState.idle, color: BallColor.red }};
    grid[9] = {id : 9, ball: { id: 9, state: BallState.idle, color: BallColor.yellow }};
    grid[15] = {id : 15, ball: { id: 15, state: BallState.idle, color: BallColor.yellow }};

    let matches = Grid.getMatches(grid, 5);
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
    // Add noise
    grid[2] = { id: 2, ball: { id: 2, state: BallState.idle, color: BallColor.red } };

    matches = Grid.getMatches(grid, 5);
    expect(matches.length).toBe(1);
    expect(matches[0].length).toBe(6);
    expect(matches[0][0]).toEqual(grid[10]);
    expect(matches[0][5]).toEqual(grid[15]);
  });


  it('getMatches should return all the vertical matches on the grid', () => {
    let grid = Grid.getGrid(9);
    for (let i = 0; i < 5; i++) {
      grid[i * 9 + 2].ball = { id: i * 9 + 2, state: BallState.idle, color: BallColor.blue };
      grid[i * 9 + 4].ball = { id: i * 9 + 4, state: BallState.idle, color: BallColor.red };
      grid[i * 9 + 8].ball = { id: i * 9 + 8, state: BallState.idle, color: BallColor.red };
    }
    grid[53].ball = grid[44].ball;
    grid[44] = { id: 44 };
    // Add noise
    grid[41] = {id : 41, ball: { id: 41, state: BallState.idle, color: BallColor.yellow }};

    let matches = Grid.getMatches(grid, 5, 9);
    expect(matches.length).toBe(2);
    expect(matches[0].length).toBe(5);
    expect(matches[0][0]).toEqual(grid[2]);
    expect(matches[0][4]).toEqual(grid[38]);

    expect(matches[1].length).toBe(5);
    expect(matches[1][0]).toEqual(grid[4]);
    expect(matches[1][4]).toEqual(grid[40]);

    grid = Grid.getGrid(9);
    for (let i = 0; i < 6; i++) {
      grid[i * 9 + 10].ball = { id: i * 9 + 10, state: BallState.idle, color: BallColor.red };
    }
    // Add noise
    grid[18] = {id : 18, ball: { id: 18, state: BallState.idle, color: BallColor.red }};
    matches = Grid.getMatches(grid, 5);
    expect(matches.length).toBe(1);
    expect(matches[0].length).toBe(6);
    expect(matches[0][0]).toEqual(grid[10]);
    expect(matches[0][5]).toEqual(grid[55]);
  });

  it('getMatches should return all the diagonal matches on the grid', () => {
    const grid = Grid.getGrid(9);
    for (let i = 0; i < 9; i++) {
      grid[(i + 1) * 8].ball = { id: (i + 1) * 8, state: BallState.idle, color: BallColor.red };
      grid[i * 10].ball = { id: i * 10, state: BallState.idle, color: BallColor.red };
    }
    grid[40] = { id: 40 };
    let matches = Grid.getMatches(grid, 5);
    expect(matches.length).toBe(0);

    grid[40] = { id: 40, ball: { id: 40, state: BallState.idle, color: BallColor.red } };
    matches = Grid.getMatches(grid, 5);
    expect(matches.length).toBe(2);
    expect(matches[0].length).toBe(9);
    expect(matches[0][0]).toEqual(grid[0]);
    expect(matches[0][8]).toEqual(grid[80]);
    expect(matches[1].length).toBe(9);
    expect(matches[1][0]).toEqual(grid[8]);
    expect(matches[1][8]).toEqual(grid[72]);
  });

  it('getMatches should return all the corner matches on the grid', () => {
    const grid = Grid.getGrid(9);
    for (let i = 0; i < 5; i++) {
      grid[i * 9].ball = { id: i * 9, state: BallState.idle, color: BallColor.red };
      grid[i].ball = { id: i, state: BallState.idle, color: BallColor.red };
    }

    const matches = Grid.getMatches(grid, 5);
    expect(matches.length).toBe(2);
    expect(matches[0].length).toBe(5);
    expect(matches[0][0]).toEqual(grid[0]);
    expect(matches[0][4]).toEqual(grid[4]);
    expect(matches[1].length).toBe(5);
    expect(matches[1][0]).toEqual(grid[0]);
    expect(matches[1][4]).toEqual(grid[36]);
  });
});
