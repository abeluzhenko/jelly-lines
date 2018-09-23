import { Injectable } from '@angular/core';
import { Ball, BallState, BallColors, BallColor } from './ball/ball.model';
import { Cell } from './cell/cell.model';
import { Subject, Observable } from 'rxjs';

export enum MoveAnimationState {
  start = 'start',
  end = 'end'
}

export interface MoveAnimationData {
  state: MoveAnimationState;
  ball: Ball;
  cell: Cell;
}

export interface Path {
  ball: Ball;
  cell: Cell;
}

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor() {
  }
}
