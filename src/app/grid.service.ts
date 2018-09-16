import { Injectable } from '@angular/core';
import { Grid } from './grid/grid.model';
import { Ball, BallState, BallColors, BallColor } from './ball/ball.model';
import { Cell } from './cell/cell.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  private _data: Grid;
  private _history: Cell[][][] = [];
  private _currentBall: Ball;
  private _cells: Cell[][];

  constructor() {
    this._data = new Grid();
    this._cells = this._data.snapshot;
  }

  public get cells(): Cell[][] {
    return this._cells;
  }

  public setCurrentBall(ball: Ball): Ball {
    if (this._currentBall === ball) {
      return null;
    }
    if (this._currentBall) {
      this._currentBall.state = BallState.idle;
    }
    this._currentBall = ball;
    this._currentBall.state = BallState.active;
    return this._currentBall;
  }

  public next(): boolean {

    const snapshot = this._data.snapshot;
    const emptyCellsFlat = this._cells
      .reduce((result, row) => result.concat(row), [])
      .filter(cell => cell.ball === null);

    if (emptyCellsFlat.length < 3) {
      return false;
    }
    let i = 3;
    while (i) {
      const r = Math.floor(Math.random() * emptyCellsFlat.length);
      const randomCell = emptyCellsFlat[r];
      randomCell.ball = new Ball(
        randomCell.state,
        BallColors[Math.floor(BallColors.length * Math.random())] as BallColor
      );
      emptyCellsFlat.splice(r, 1);
      i--;
    }
    this._history.push(snapshot);
    return true;
  }

  public randomize() {
    this._data.randomize();
    this._cells = this._data.snapshot;
  }
}
