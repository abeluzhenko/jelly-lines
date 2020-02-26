import { Cell } from './Cell';

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
