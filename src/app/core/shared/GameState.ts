import { TurnData } from './TurnData';
import { UIData } from './UIData';
import { GridAnimation } from './GridAnimation';
import { Grid } from './Grid';

export interface IGameState {
  turn: TurnData;
  ui: UIData;
  animation: GridAnimation[];
}

export class GameState implements IGameState {
  constructor(
    public turn: TurnData = {
      cells: Grid.getGrid(),
      cell: null,
    } as TurnData,
    public ui: UIData = {
      nextColors: [],
      score: 0,
      turn: 0,
    },
    public animation: GridAnimation[] = [],
  ) {}
}
