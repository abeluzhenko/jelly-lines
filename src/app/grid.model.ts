import { BallColors, BallColor, BallState } from './ball/ball.model';
import { ICell } from './cell/cell.model';

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
      flatGrid: { cell: ICell, slope: number }[],
      matches: ICell[][]
    ) => {
      if (flatGrid.length < length) {
        return [];
      }
      const primeItem = flatGrid[0];
      let lastItem = flatGrid[1];
      let lastSequenceItem = isAdjacent(primeItem.cell, lastItem.cell) ? lastItem : primeItem;
      let sequence = [];
      const sequencies = [];
      // console.log('>', primeItem.cell.id);
      for (let i = 2; i <= flatGrid.length; i++) {
        const currentItem = flatGrid[i];
        // console.log('>>', currentItem && currentItem.cell.id);
        if (currentItem
          && (currentItem.slope === lastItem.slope)
          && isAdjacent(lastSequenceItem.cell, currentItem.cell)
        ) {
          if (!sequence.length) {
            sequence.push(lastItem);
          }
          // console.log('>>', sequence.map(s => s.cell.id));
          sequence.push(currentItem);
          lastSequenceItem = currentItem;
          lastItem = currentItem;
          continue;
        }
        if (sequence.length >= length - 1) {
          const n = [primeItem, ...sequence].map(data => data.cell);
          if (!matches.some(s => s[s.length - 1].id === n[n.length - 1].id)) {
            sequencies.push(n);
            // console.log(n, sequence.length, length - 2);
          }
        }
        if (currentItem) {
          sequence = [];
          lastItem = currentItem;
          lastSequenceItem = isAdjacent(primeItem.cell, lastItem.cell) ? lastItem : primeItem;
        }
      }
      return sequencies;
    };
    for (let i = 0; i < grid.length - length + 1; i++) {
      if (!grid[i].ball) {
        continue;
      }
      const currItem = grid[i];
      const currPos = Grid.getPosition(i, gridSize);
      const sortedGrid = grid
        .slice(i)
        .filter(cell => cell.ball && cell.ball.color === currItem.ball.color)
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
        ...getSequences(sortedGrid, result)
      ];
    }
    return result;
  }
}
