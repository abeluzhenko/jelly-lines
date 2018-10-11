import { TestBed, inject } from '@angular/core/testing';
import { getClosestCell, PathCell, getAdjacent } from './path.model';

fdescribe('Path module', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
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
      const adjacent = getAdjacent(cell, grid);
      expect(adjacent.length).toBe(2);
      expect(adjacent).toContain(n1);
      expect(adjacent).toContain(n2);
    };
    const checkSide = (cell, n1, n2, n3) => {
      const adjacent = getAdjacent(cell, grid);
      expect(adjacent.length).toBe(3);
      expect(adjacent).toContain(n1);
      expect(adjacent).toContain(n2);
      expect(adjacent).toContain(n3);
    };
    const checkOther = (cell, n1, n2, n3, n4) => {
      const adjacent = getAdjacent(cell, grid);
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
  });
});
