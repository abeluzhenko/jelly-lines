import { Injectable } from '@angular/core';
import { Grid } from './grid/grid.model';
import { Ball, BallState } from './ball/ball.model';
import { Cell } from './cell/cell.model';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  private _data: Grid;
  private _currentBall: Ball;

  constructor() {
    this._data = new Grid();
    this._data.randomize();
  }

  public get data(): Cell[][] {
    return this._data.snapshot;
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
}
