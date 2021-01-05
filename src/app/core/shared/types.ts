import { BallColor, BallState } from './consts';
import { GridAnimationType } from './';

export interface Ball {
  id: number;
  state: BallState;
  color: BallColor;
}

export interface Cell {
  id: number;
  ball?: Ball;
}

export interface GameState {
  turn: TurnData;
  ui: UIData;
  animation: GridAnimation[];
}

export type Actions = SelectCellAction | StartGameAction;

export interface Action {
  payload?: Cell;
}

export class SelectCellAction implements Action {
  constructor(public payload: Cell) {}
}

export class StartGameAction implements Action {
  constructor() {}
}

export interface UIData {
  nextColors: BallColor[];
  score: number;
  turn: number;
}

export interface TurnData {
  cells: Cell[];
  cell?: Cell;
}

export interface GridAnimation {
  type: GridAnimationType;
  cells?: Cell[];
}
