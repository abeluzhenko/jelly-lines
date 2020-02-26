import { Cell } from './Cell';

export enum GridAnimationType {
  None,
  Add,
  Move,
  Match,
  Wrong,
  Full,
}

export interface GridAnimation {
  type: GridAnimationType;
  cells?: Cell[];
}
