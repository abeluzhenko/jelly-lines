import { Ball } from '../ball/ball.model';

export enum CellState {
  empty = 0,
  full = 1,
}

export class Cell {
  id: number;
  state: CellState;
  ball: Ball;
  constructor(
    id: number,
    ball: Ball = null,
    state: CellState = CellState.empty
  ) {
    this.id = id;
    this.state = state;
    this.ball = ball;
  }
}
