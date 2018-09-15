import { Ball } from '../ball/ball.model';

export enum CellState {
  empty = 0,
  full = 1,
}

export class Cell {
  state: CellState;
  ball: Ball;
  constructor(ball: Ball, state: CellState = CellState.empty) {
    this.state = state;
    this.ball = ball;
  }
}
