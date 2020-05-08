import { TurnData } from './TurnData';
import { UIData } from './UIData';
import { GridAnimation } from './GridAnimation';
import { getGrid } from './Grid';

export interface GameState {
  turn: TurnData;
  ui: UIData;
  animation: GridAnimation[];
}

export const INITIAL_STATE: GameState = {
  turn: {
    cells: getGrid(),
  },
  ui: {
    nextColors: [],
    score: 0,
    turn: 0,
  },
  animation: []
};
