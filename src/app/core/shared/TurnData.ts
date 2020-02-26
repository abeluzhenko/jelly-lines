import { UIData } from './UIData';
import { Cell } from './Cell';

export interface TurnData extends UIData {
  cells: Cell[];
  cell?: Cell | null;
}
