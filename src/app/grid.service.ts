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

export const DEFAULT_GRID_SIZE = 9;

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor() {
  }

  public getGrid(size: number = DEFAULT_GRID_SIZE): Cell[] {
    const result: Cell[] = [];
    for (let i = 0; i < size * 2; i++) {
      result.push({
        id: i,
        ball: {
          id: i,
          color: BallColor.red,
          state: BallState.idle
        }
      });
    }
    return result;
  }
}
