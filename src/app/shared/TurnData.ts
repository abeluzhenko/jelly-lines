import { IUIData } from './UIData';
import { ICell } from './Cell';
import { BallColor } from './Ball';

export interface ITurnData extends IUIData {
  cells: ICell[];
  score: number;
  nextColors: BallColor[];
  cell?: ICell;
}
