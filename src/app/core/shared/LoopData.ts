import { ITurnData } from './TurnData';
import { ICell } from './Cell';

export interface ILoopData {
  turn: ITurnData;
  matches: ICell[][];
  updated?: ICell[];
}
