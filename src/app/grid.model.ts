import { BallColors, BallColor, BallState } from './ball/ball.model';
import { ICell } from './cell/cell.model';

export interface ITurnData {
  cells: ICell[];
  cell?: ICell;
  nextColors?: BallColor[];
}

export enum GridAnimationType {
  Move = 0,
  Match = 1,
  Wrong = 2,
}

export interface IGridAnimation {
  type: GridAnimationType;
  cells: ICell[];
}

export class Grid {

  public static SIZE = 9;
  public static ITEMS_PER_TURN = 3;

  public static getRandomColor(): BallColor {
    return BallColors[Math.floor(BallColors.length * Math.random())];
  }

  public static getGrid(size: number = Grid.SIZE): ICell[] {
    const result: ICell[] = [];
    for (let i = 0; i < size * size; i++) {
      result.push({ id: i });
    }
    return result;
  }

  public static getRandomGrid(size: number = Grid.SIZE): ICell[] {
    const result: ICell[] = [];
    for (let i = 0; i < size * size; i++) {
      result.push({ id: i, ball: { id: i, color: Grid.getRandomColor(), state: BallState.idle} });
    }
    return result;
  }

  public static getPosition(
    index: number,
    gridSize = Grid.SIZE
  ): { x: number, y: number } {
    return {
      y: Math.floor(index / gridSize),
      x: index % gridSize,
    };
  }

  public static getMatches(grid: ICell[], length = 5, gridSize = Grid.SIZE): ICell[][] {
    const ROW = 1000;
    const COLUMN = -1000;
    const CURRENT = -2000;
    let result = [];

    const isAdjacent = (cell0: ICell, cell1: ICell): boolean => {
      const x0 = Math.floor(cell0.id / gridSize);
      const y0 = cell0.id % gridSize;
      const x1 = Math.floor(cell1.id / gridSize);
      const y1 = cell1.id % gridSize;
      const dx = Math.abs(x0 - x1);
      const dy = Math.abs(y0 - y1);
      return ((dx === 1 && dy === 1) || (!dx && dy === 1) || (!dy && dx === 1));
    };

    const getSequences = (
      flatGrid: { cell: ICell, slope: number }[]
    ) => {
      const firstItem = flatGrid[0];
      let sequenceLength = 1;
      let lastItem: { cell: ICell, slope: number } = flatGrid[1];
      const sequencies = [];
      for (let i = 2; i <= flatGrid.length; i++) {
        const currentItem = flatGrid[i];
        if (currentItem
          && lastItem.cell.ball
          && currentItem.cell.ball
          && lastItem.slope === currentItem.slope
          && currentItem.cell.ball.color === firstItem.cell.ball.color
        ) {
          sequenceLength++;
          lastItem = currentItem;
          continue;
        }
        if (sequenceLength >= length - 1) {
          const n = flatGrid
            .slice(i - sequenceLength, i)
            .map(data => data.cell);
          n.unshift(firstItem.cell);
          if (n.every((el, j) => !j || isAdjacent(n[j - 1], el))) {
            sequencies.push(n);
          }
        }
        sequenceLength = 1;
        lastItem = currentItem;
      }
      return sequencies;
    };
    for (let i = 0; i < grid.length; i++) {
      const currItem = grid[i];
      if (!currItem.ball) {
        continue;
      }
      const currPos = Grid.getPosition(i, gridSize);
      const sortedGrid = grid
        .map(cell => {
          const cellPos = Grid.getPosition(cell.id, gridSize);
          let slope = 0;
          if (cell.id === currItem.id) {
            slope = CURRENT;
          } else if (currPos.x === cellPos.x) {
            slope = ROW;
          } else if (currPos.y === cellPos.y) {
            slope = COLUMN;
          } else {
            slope = (cellPos.y - currPos.y) / (cellPos.x - currPos.x);
          }
          return { cell, slope };
        })
        .sort((a, b) => a.slope > b.slope ? 1 : (a.slope < b.slope ? -1 : a.cell.id - b.cell.id));
      result = [
        ...result,
        ...getSequences(sortedGrid)
      ];
    }
    return result;
  }
}
