import { TestBed, inject } from '@angular/core/testing';
import { getClosestCell, PathCell, getAdjacent, getDistance, makePath, getPathGrid, getPath } from './path.model';
import { Cell } from './cell/cell.model';
import { BallState, BallColor } from './ball/ball.model';

describe('Path module', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('getGrid should return a proper grid', () => {
    const cells: Cell[] = [];
    for (let i = 0; i < 100; i++) {
      cells.push({ id: i });
    }
    let grid: PathCell[] = getPathGrid(cells);
    expect(grid).toBeTruthy();
    expect(grid.length).toBe(100);
    expect(grid[50].order).toBe(0);
    expect(grid[50].cost).toBe(1);

    cells[50].ball = {
      id: cells[50].id,
      state: BallState.idle,
      color: BallColor.purple
    };
    grid = getPathGrid(cells);
    expect(grid[50].cost).toBe(Number.POSITIVE_INFINITY);
  });

  it('getClosest cells should return the closest cell', () => {
    const cells: Set<PathCell> = new Set();
    for (let i = 0; i < 10; i++) {
      cells.add({
        index: i,
        cost: i,
      });
    }
    expect(getClosestCell(cells)).toEqual({ index: 0, cost: 0 });
    cells.add({ index: 10, cost: -1 });
    expect(getClosestCell(cells)).toEqual({ index: 10, cost: -1 });
    cells.add({ index: 11, cost: Number.NEGATIVE_INFINITY });
    expect(getClosestCell(cells)).toEqual({ index: 11, cost: Number.NEGATIVE_INFINITY });
  });

  it('getAdjacent should return all the adjacent to the input cell', () => {
    const grid: PathCell[] = [];
    for (let i = 0; i < 100; i++) {
      grid.push({ index: i });
    }

    const checkCorner = (cell, n1, n2) => {
      const adjacent = getAdjacent(cell, grid, 10);
      expect(adjacent.length).toBe(2);
      expect(adjacent).toContain(n1);
      expect(adjacent).toContain(n2);
    };
    const checkSide = (cell, n1, n2, n3) => {
      const adjacent = getAdjacent(cell, grid, 10);
      expect(adjacent.length).toBe(3);
      expect(adjacent).toContain(n1);
      expect(adjacent).toContain(n2);
      expect(adjacent).toContain(n3);
    };
    const checkOther = (cell, n1, n2, n3, n4) => {
      const adjacent = getAdjacent(cell, grid, 10);
      expect(adjacent.length).toBe(4);
      expect(adjacent).toContain(n1);
      expect(adjacent).toContain(n2);
      expect(adjacent).toContain(n3);
      expect(adjacent).toContain(n4);
    };

    // Corner cases
    // Top left
    checkCorner(grid[0], grid[1], grid[10]);
    // Top right
    checkCorner(grid[9], grid[8], grid[19]);
    // Bottom left
    checkCorner(grid[90], grid[91], grid[80]);
    // Bottom right
    checkCorner(grid[99], grid[89], grid[98]);

    // Sides
    // Top center
    checkSide(grid[5], grid[4], grid[6], grid[15]);
    // Bottom center
    checkSide(grid[95], grid[94], grid[96], grid[85]);
    // Left center
    checkSide(grid[49], grid[39], grid[48], grid[59]);
    // Right center
    checkSide(grid[40], grid[50], grid[30], grid[41]);

    checkOther(grid[55], grid[54], grid[56], grid[65], grid[45]);

    // Invalid input
    expect(getAdjacent({ index: Number.POSITIVE_INFINITY }, grid)).toEqual([]);
    expect(getAdjacent({ index: Number.NEGATIVE_INFINITY }, [])).toEqual([]);
  });

  it('getDistance should return a correct Manhatan distance value', () => {
    expect(getDistance({ index: 0 }, { index: 22 }, 10)).toBe(4);
    expect(getDistance({ index: 0 }, { index: 99 }, 10)).toBe(18);
    expect(getDistance({ index: 10 }, { index: 11 }, 10)).toBe(1);
    expect(getDistance({ index: 50 }, { index: 50 }, 10)).toBe(0);
    expect(getDistance({ index: 0 }, { index: 9 }, 10)).toBe(9);

    // Invalid input
    expect(getDistance({ index: undefined }, { index: undefined }, 10)).toBeNaN();
    expect(getDistance({ index: 0 }, { index: undefined }, 10)).toBeNaN();
    expect(getDistance({ index: Number.POSITIVE_INFINITY }, { index: Number.NEGATIVE_INFINITY }, 10)).toBeNaN();
  });

  it('makePath should return a correct path array', () => {
    const grid: PathCell[] = [];
    for (let i = 0; i < 100; i++) {
      grid.push({ index: i, order: i + 1 });
    }
    let path = makePath(grid[9], grid, getAdjacent, 0, 10);
    expect(path.length).toBe(10);
    expect(path[0]).toBe(grid[0]);
    expect(path[9]).toBe(grid[9]);

    path = makePath(grid[99], grid, getAdjacent, 0, 10);
    expect(path.length).toBe(0);

    const p = [ 0, 1, 2, 12, 22, 21, 20 ];
    for (let i = 0; i < 100; i++) {
      const index = p.indexOf(i);
      if (index !== -1) {
        grid[i].order = index + 1;
        continue;
      }
      grid[i].order = 0;
    }
    path = makePath(grid[20], grid, getAdjacent, 0, 10);
    expect(path.length).toBe(7);
    expect(path.map(el => el.index)).toEqual(p);
  });

  it('getPath should return the shortest path between two points', () => {
    const grid: PathCell[] = [];
    for (let i = 0; i < 100; i++) {
      grid.push({ index: i, cost: 0, order: 0 });
    }
    let path = getPath(grid[0], grid[99], grid, 0, 10);
    expect(path).not.toEqual([]);
    expect(path.length).toBe(19);

    for (let i = 0; i < 10; i++) {
      grid[10 + i].cost = Number.POSITIVE_INFINITY;
    }
    path = getPath(grid[0], grid[20], grid, 0, 10);
    expect(path).toEqual([]);

    grid[19].cost = 1;
    path = getPath(grid[0], grid[20], grid, 0, 10);
    expect(path).not.toEqual([]);
    expect(path.length).toBe(21);

    path = getPath(grid[0], grid[1], grid, 0, 10);
    expect(path).not.toEqual([]);
    expect(path.length).toBe(2);
  });
});
