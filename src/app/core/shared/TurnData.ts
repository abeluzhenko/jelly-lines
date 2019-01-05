import { IUIData } from './UIData';
import { ICell } from './Cell';

export interface ITurnData extends IUIData {
  cells: ICell[];
  cell?: ICell | null;
}
