import { ICell } from './Cell';

export type Action = SelectCellAction | StartGameAction;

export interface IAction {
  payload?: ICell;
}

export class SelectCellAction implements IAction {
  constructor(public payload: ICell) {}
}

export class StartGameAction implements IAction {
  constructor() {}
}
