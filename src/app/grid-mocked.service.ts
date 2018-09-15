import { Injectable } from '@angular/core';
import { Grid } from './grid/grid.model';
import { Ball, BallState } from './ball/ball.model';
import { GridService } from './grid.service';

export class GridServiceMocked extends GridService {

  constructor() {
    super();
  }

  public setCurrentBall(ball: Ball): Ball {
    return super.setCurrentBall(ball);
  }
}
