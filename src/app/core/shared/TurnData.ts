import { Cell, UIData } from './';


export interface TurnData extends Partial<UIData> {
  cells: Cell[];
  cell?: Cell;
}
