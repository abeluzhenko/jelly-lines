import { BallColors, BallColor, BallState } from './ball/ball.model';
import { ICell } from './cell/cell.model';
import { Path } from './path.model';

export interface IGridInput {
  cells: ICell[];
  cell?: ICell;
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

  public static ITEMS_PER_TURN = 3;

  public static getRandomColor(): BallColor {
    return BallColors[Math.floor(BallColors.length * Math.random())];
  }

  public static getGrid(size: number = Path.GRID_SIZE): ICell[] {
    const result: ICell[] = [];
    for (let i = 0; i < size * size; i++) {
      result.push({ id: i });
    }
    return result;
  }

  public static getRandomGrid(size: number = Path.GRID_SIZE): ICell[] {
    const result: ICell[] = [];
    for (let i = 0; i < size * size; i++) {
      result.push({ id: i, ball: { id: i, color: Grid.getRandomColor(), state: BallState.idle} });
    }
    return result;
  }
}
