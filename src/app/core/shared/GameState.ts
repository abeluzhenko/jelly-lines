import { ITurnData } from './TurnData';
import { IUIData } from './UIData';
import { IGridAnimation } from './GridAnimation';
import { Grid } from './Grid';

export interface IGameState {
  turn: ITurnData;
  ui: IUIData;
  animation: IGridAnimation[];
}

export class GameState implements IGameState {
  constructor(
    public turn: ITurnData = {
      cells: Grid.getGrid(),
      cell: null,
    },
    public ui: IUIData = {
      nextColors: [],
      score: 0,
    },
    public animation: IGridAnimation[] = [],
  ) {}
}
