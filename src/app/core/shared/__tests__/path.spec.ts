import { Cell, BallState, BallColor, PathCell } from '../';
import * as Path from '../path';


const DEFAULT_LENGTH = 100;
const DEFAULT_SIZE = 10;

const generatePathGridMock = (): PathCell[] =>
  Array.from({ length: DEFAULT_LENGTH }, (_el, index) => ({
    index,
    cost: 0,
    order: 0
  }));

describe('Path module', () => {
  describe('getGrid should return', () => {
    const cells: Cell[] = Array.from({ length: DEFAULT_LENGTH }, (_el, id) => ({
      id
    }));
    const grid: PathCell[] = Path.getPathGrid(cells);
    const testCellIndex = 50;

    it('a grid with proper size', () => {
      expect(grid.length).toBe(DEFAULT_LENGTH);
    });

    it('a grid with proper cells values', () => {
      expect(grid[testCellIndex]).toEqual({ index: testCellIndex, order: 0, cost: 1 });
    });

    it('a grid with untraversable cells', () => {
      const changedCells: Cell[] = Array.from({ length: DEFAULT_LENGTH }, (_el, id) => ({
        id,
        ...(id === testCellIndex
          ? { ball: { id, state: BallState.idle, color: BallColor.purple }}
          : {}
        )
      }));
      const changedGrid: PathCell[] = Path.getPathGrid(changedCells);

      expect(changedGrid[testCellIndex].cost).toBe(Number.POSITIVE_INFINITY);
    });
  });

  describe('getClosest should return', () => {
    const cellsAmount = 10;
    let cells: Set<PathCell>;

    beforeEach(() => {
      cells = new Set(Array.from({ length: cellsAmount }, (_el, index) => ({
        index,
        cost: index
      })));
    });

    it('the first cell on a fresh grid', () => {
      expect(Path.getClosestCell(cells)).toEqual({ index: 0, cost: 0 });
    });

    it('a cell with the lowest cost', () => {
      cells.add({ index: 11, cost: Number.NEGATIVE_INFINITY });

      expect(Path.getClosestCell(cells))
        .toEqual({ index: 11, cost: Number.NEGATIVE_INFINITY });
    });
  });

  describe('getAdjacent should return', () => {
    const grid = generatePathGridMock();

    const getCellsByIndex = (...indices: number[]) => indices.map((i) => grid[i]);

    const isAdjacent = (
      cells: PathCell[]
    ) => {
      const [target, ...neighbours] = cells;
      const adjacent = Path.getAdjacent(target, grid, DEFAULT_SIZE);

      return neighbours.every(
        (neighbour) => adjacent.find(
          ({ index }) => neighbour.index === index
        )
      );
    };

    // tslint:disable: no-magic-numbers
    it('all the adjacent cells for a corner', () => {
      expect(isAdjacent(getCellsByIndex(0, 1, 10))).toBeTruthy('top left');
      expect(isAdjacent(getCellsByIndex(9, 8, 19))).toBeTruthy('top right');
      expect(isAdjacent(getCellsByIndex(90, 91, 80))).toBeTruthy('bottom left');
      expect(isAdjacent(getCellsByIndex(99, 89, 98))).toBeTruthy('bottom right');
    });

    it('all the adjacent cell for a side', () => {
      expect(isAdjacent(getCellsByIndex(5, 4, 6, 15))).toBeTruthy('top center');
      expect(isAdjacent(getCellsByIndex(95, 94, 96, 85))).toBeTruthy('bottom center');
      expect(isAdjacent(getCellsByIndex(49, 39, 48, 59))).toBeTruthy('left center');
      expect(isAdjacent(getCellsByIndex(40, 50, 30, 41))).toBeTruthy('right center');
    });

    it('all the adjacent cell for the center', () => {
      expect(isAdjacent(getCellsByIndex(55, 54, 56, 65, 45))).toBeTruthy();
    });
    // tslint:enable: no-magic-numbers

    it('an empty array for invalid input', () => {
      expect(Path.getAdjacent({ index: Number.POSITIVE_INFINITY }, grid)).toEqual([]);
      expect(Path.getAdjacent({ index: Number.NEGATIVE_INFINITY }, [])).toEqual([]);
    });
  });

  describe('getDistance should return', () => {
    // tslint:disable: no-magic-numbers
    it('return a correct Manhattan distance value', () => {
      expect(Path.getDistance({ index: 0 }, { index: 22 }, 10)).toBe(4, 'forward');
      expect(Path.getDistance({ index: 10 }, { index: 11 }, 10)).toBe(1, 'one step');
      expect(Path.getDistance({ index: 50 }, { index: 50 }, 10)).toBe(0, 'the same cell');
      expect(Path.getDistance({ index: 0 }, { index: 9 }, 10)).toBe(9, 'backward');
    });

    it('return NaN on invalid input', () => {
      expect(Path.getDistance({ index: undefined }, { index: undefined }, 10)).toBeNaN();
      expect(Path.getDistance({ index: 0 }, { index: undefined }, 10)).toBeNaN();
      expect(Path.getDistance({ index: Number.POSITIVE_INFINITY }, { index: Number.NEGATIVE_INFINITY }, 10)).toBeNaN();
    });
    // tslint:enable: no-magic-numbers
  });

  describe('makePath', () => {
    const PATH_LENGTH = 10;
    const grid: PathCell[] = Array.from({ length: DEFAULT_LENGTH }, (_el, index: number) => ({
      index,
      order: index + 1
    }));

    it('should return a correct straight path', () => {
      const path = Path.makePath(grid[PATH_LENGTH - 1], grid, Path.getAdjacent, 0, PATH_LENGTH);
      const expectedPathBorders = [grid[0], grid[PATH_LENGTH - 1]];
      const actualPathBorders = [path[0], path[PATH_LENGTH - 1]];

      expect(actualPathBorders).toEqual(expectedPathBorders);
    });

    it('should return an empty array is there is no path', () => {
      const path = Path.makePath(grid[DEFAULT_LENGTH - 1], grid, Path.getAdjacent, 0, PATH_LENGTH);

      expect(path).toEqual([]);
    });

    it('should return a correct curved path', () => {
      // tslint:disable-next-line: no-magic-numbers
      const expectedPathPoints = [0, 1, 2, 12, 22, 21, 20];
      const [lastPathPoint] = expectedPathPoints.slice().reverse();
      const reorderedGrid = grid.map((cell, i) => {
        const index = expectedPathPoints.indexOf(i);

        return {
          ...cell,
          order: index !== - 1 ? index + 1 : 0
        };
      });

      const path = Path.makePath(
        reorderedGrid[lastPathPoint],
        reorderedGrid,
        Path.getAdjacent,
        0,
        PATH_LENGTH
      );
      const actualPathPoints = path.map(({ index }) => index);

      expect(actualPathPoints).toEqual(expectedPathPoints);
    });
  });

  describe('getPath should return', () => {
    let grid: PathCell[];

    const getIndices = (values: ({ index: number })[]): number[] =>
      values.map(({ index }) => index);

    beforeEach(() => {
      grid = generatePathGridMock();
    });

    // tslint:disable: no-magic-numbers
    it('a simple path', () => {
      const actualPath = Path.getPath(grid[0], grid[1], grid, 0, DEFAULT_SIZE);
      expect(getIndices(actualPath)).toEqual([0, 1]);
    });

    it('a corner path', () => {
      const actualPath = Path.getPath(grid[0], grid[99], grid, 0, DEFAULT_SIZE);

      expect(getIndices(actualPath))
        .toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 29, 39, 49, 59, 69, 79, 89, 99]);
    });

    it('a complex path', () => {
      for (let i = 0; i < 9; i++) {
        grid[10 + i].cost = Number.POSITIVE_INFINITY;
      }
      const actualPath = Path.getPath(grid[0], grid[20], grid, 0, DEFAULT_SIZE);

      expect(getIndices(actualPath))
        .toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20]);
    });

    it('an untraversable path', () => {
      for (let i = 0; i < 10; i++) {
        grid[10 + i].cost = Number.POSITIVE_INFINITY;
      }
      const actualPath = Path.getPath(grid[0], grid[20], grid, 0, DEFAULT_SIZE);

      expect(actualPath).toEqual([]);
    });
  });
});
