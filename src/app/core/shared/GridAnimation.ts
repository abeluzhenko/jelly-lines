import { ICell } from './Cell';

export enum GridAnimationType {
  None,
  Add,
  Move,
  Match,
  Wrong,
  Full,
}

export interface IGridAnimation {
  type: GridAnimationType;
  cells?: ICell[];
}
