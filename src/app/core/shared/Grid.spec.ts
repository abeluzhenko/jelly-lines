import { Grid } from './Grid';
import { BallState, BallColor } from './Ball';
import { Cell } from './Cell';


const DEFAULT_GRID_SIZE = 9;
const DEFAULT_MATCH_LENGTH = 5;

describe('Grid module', () => {
  describe('getGrid should return', () => {
    it('a grid of proper size', () => {
      const gridSize = 10;
      const expectedGridLength = 100;

      expect(Grid.getGrid(gridSize).length).toBe(expectedGridLength);
    });

    it('a grid with properly instanciated cells', () => {
      const cellIndex = 50;
      const grid = Grid.getGrid(DEFAULT_GRID_SIZE);

      expect(grid[cellIndex]).toEqual({ id: cellIndex });
    });
  });

  describe('getMatches should return', () => {
    let grid: Cell[];

    const state = BallState.idle;

    const getCellsByIndecies = (...indecies: number[]) => indecies.map((index) => grid[index]);

    beforeEach(() => {
      grid = Grid.getGrid(DEFAULT_GRID_SIZE);
    });

    it('an empty array when there are zero matches', () => {
      expect(Grid.getMatches(Grid.getGrid(DEFAULT_GRID_SIZE), DEFAULT_MATCH_LENGTH))
        .toEqual([]);
    });

    describe('all the horizontal matches', () => {
      // tslint:disable: no-magic-numbers
      it('two short matches', () => {
        const matchesStartIndecies = [2, 10, 15, 30];
        const matchesColors = [BallColor.blue, BallColor.red, BallColor.green, BallColor.green];
        for (let i = 0; i < DEFAULT_MATCH_LENGTH; i++) {
          matchesStartIndecies.forEach((index) => {
            grid[i + index].ball = { id: i + index, state, color: matchesColors[index] };
          });
        }

        grid[29].ball = grid[30].ball;
        grid[30] = { id: 30 };

        [
          { id : 8, ball: { id: 8, state, color: BallColor.red } },
          { id : 9, ball: { id: 9, state, color: BallColor.yellow } },
          { id : 15, ball: { id: 15, state, color: BallColor.yellow } }
        ].forEach((cell) => {
          grid[cell.id] = cell;
        });

        expect(Grid.getMatches(grid, DEFAULT_MATCH_LENGTH)).toEqual([
          getCellsByIndecies(2, 3, 4, 5, 6),
          getCellsByIndecies(10, 11, 12, 13, 14)
        ]);
      });

      it('one long match', () => {
        for (let i = 0; i < DEFAULT_MATCH_LENGTH + 1; i++) {
          grid[i + 10].ball = { id: i + 10, state, color: BallColor.red };
        }
        grid[2] = { id: 2, ball: { id: 2, state, color: BallColor.red } };

        expect(Grid.getMatches(grid, DEFAULT_MATCH_LENGTH)).toEqual([
          getCellsByIndecies(10, 11, 12, 13, 14, 15)
        ]);
      });
    });

    describe('all the vertical matches', () => {
      it('two short matches', () => {
        const matchesStartIndecies = [2, 4, 8];
        const matchesColors = [BallColor.blue, BallColor.blue, BallColor.red, BallColor.red];
        for (let i = 0; i < DEFAULT_MATCH_LENGTH; i++) {
          matchesStartIndecies.forEach((index) => {
            grid[i * DEFAULT_GRID_SIZE + index].ball = {
              id: i + index,
              state,
              color: matchesColors[index]
            };
          });
        }

        grid[53].ball = grid[44].ball;
        grid[44] = { id: 44 };

        grid[41] = {id : 41, ball: { id: 41, state, color: BallColor.yellow }};

        expect(Grid.getMatches(grid, DEFAULT_MATCH_LENGTH, DEFAULT_GRID_SIZE)).toEqual([
          getCellsByIndecies(2, 11, 20, 29, 38),
          getCellsByIndecies(4, 13, 22, 31, 40),
        ]);
      });

      it('one long match', () => {
        for (let i = 0; i < DEFAULT_MATCH_LENGTH + 1; i++) {
          grid[i * DEFAULT_GRID_SIZE + 10].ball = {
            id: i * DEFAULT_GRID_SIZE + 10,
            state,
            color: BallColor.red
          };
        }

        grid[18] = {id : 18, ball: { id: 18, state, color: BallColor.red }};
        expect(Grid.getMatches(grid, DEFAULT_MATCH_LENGTH)).toEqual([
          getCellsByIndecies(10, 19, 28, 37, 46, 55)
        ]);
      });
    });

    describe('all the diagonal matches', () => {
      const color = BallColor.red;

      it('no matches', () => {
        expect(Grid.getMatches(grid, DEFAULT_MATCH_LENGTH)).toEqual([]);
      });

      it('simple match', () => {
        for (let i = 0; i < DEFAULT_GRID_SIZE; i++) {
          grid[(i + 1) * 8].ball = { id: (i + 1) * 8, state, color };
          grid[i * 10].ball = { id: i * 10, state, color };
        }
        grid[40] = { id: 40 };
        grid[40] = { id: 40, ball: { id: 40, state, color } };

        expect(Grid.getMatches(grid, DEFAULT_MATCH_LENGTH)).toEqual([
          getCellsByIndecies(0, 10, 20, 30, 40, 50, 60, 70, 80),
          getCellsByIndecies(8, 16, 24, 32, 40, 48, 56, 64, 72)
        ]);
      });
    });

    it('all the corner matches', () => {
      const color = BallColor.red;
      for (let i = 0; i < DEFAULT_MATCH_LENGTH; i++) {
        grid[i * DEFAULT_GRID_SIZE].ball = { id: i * DEFAULT_GRID_SIZE, state, color };
        grid[i].ball = { id: i, state, color };
      }

      expect(Grid.getMatches(grid, DEFAULT_MATCH_LENGTH)).toEqual([
        getCellsByIndecies(0, 1, 2, 3, 4),
        getCellsByIndecies(0, 9, 18, 27, 36),
      ]);
    });
    // tslint:enable: no-magic-numbers
  });
});
