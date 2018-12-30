import { ICell } from './Cell';

export enum GridAnimationType {
  Add = 0,
  Move = 1,
  Match = 2,
  Wrong = 3,
  Full = 4,
}

export interface IGridAnimation {
  type: GridAnimationType;
  cells?: ICell[];
}
